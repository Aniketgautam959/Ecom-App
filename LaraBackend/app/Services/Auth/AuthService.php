<?php

namespace App\Services\Auth;

use App\Exceptions\Auth\InactiveAccountException;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Exceptions\Auth\PasswordResetException;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @return array{user: UserResource, token: string}
     */
    public function register(array $data): array
    {
        $user = $this->userRepository->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'] ?? null,
            'email_id' => $data['email_id'],
            'password' => $data['password'],
        ]);

        return [
            'user' => new UserResource($user),
            'token' => $this->createToken($user),
        ];
    }

    /**
     * @return array{user: UserResource, token: string}
     */
    public function login(string $emailId, string $password, ?string $ipAddress = null): array
    {
        $this->ensureLoginIsNotRateLimited($emailId, $ipAddress);

        $user = $this->userRepository->findByEmail($emailId);

        if (! $user || ! Hash::check($password, $user->password)) {
            RateLimiter::hit($this->loginThrottleKey($emailId, $ipAddress));

            throw new InvalidCredentialsException;
        }

        if (! $user->status) {
            throw new InactiveAccountException;
        }

        RateLimiter::clear($this->loginThrottleKey($emailId, $ipAddress));

        return [
            'user' => new UserResource($user),
            'token' => $this->createToken($user),
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function getAuthenticatedUser(User $user): UserResource
    {
        return new UserResource($user);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(User $user, array $data): UserResource
    {
        $updatedUser = $this->userRepository->update($user, $data);

        return new UserResource($updatedUser);
    }

    public function sendPasswordResetLink(string $emailId): string
    {
        $status = Password::broker('users')->sendResetLink([
            'email_id' => $emailId,
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new PasswordResetException(__($status));
        }

        return __($status);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function resetPassword(array $data): string
    {
        $status = Password::broker('users')->reset(
            [
                'email_id' => $data['email_id'],
                'password' => $data['password'],
                'password_confirmation' => $data['password_confirmation'] ?? null,
                'token' => $data['token'],
            ],
            function (User $user, string $password) {
                $this->userRepository->update($user, [
                    'password' => $password,
                ]);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new PasswordResetException(__($status));
        }

        return __($status);
    }

    public function changePassword(User $user, string $newPassword): void
    {
        $this->userRepository->update($user, [
            'password' => Hash::make($newPassword),
        ]);
    }

    public static function passwordRules(): array
    {
        return ['required', 'confirmed', PasswordRule::defaults()];
    }

    private function createToken(User $user): string
    {
        return $user->createToken('api-token')->plainTextToken;
    }

    private function ensureLoginIsNotRateLimited(string $emailId, ?string $ipAddress): void
    {
        $key = $this->loginThrottleKey($emailId, $ipAddress);

        if (! RateLimiter::tooManyAttempts($key, 5)) {
            return;
        }

        event(new Lockout(request()));

        $seconds = RateLimiter::availableIn($key);

        throw new TooManyRequestsHttpException(
            $seconds,
            trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ])
        );
    }

    private function loginThrottleKey(string $emailId, ?string $ipAddress): string
    {
        return Str::transliterate(Str::lower($emailId).'|'.($ipAddress ?? 'unknown'));
    }
}
