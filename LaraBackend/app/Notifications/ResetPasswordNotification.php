<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;

class ResetPasswordNotification extends ResetPassword
{
    /**
     * Build the password reset URL for the notification.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function resetUrl($notifiable): string
    {
        $frontendUrl = config('auth.frontend_reset_password_url');

        if (empty($frontendUrl)) {
            return parent::resetUrl($notifiable);
        }

        $email = $notifiable->getEmailForPasswordReset();

        return rtrim($frontendUrl, '?')
            . '?token=' . urlencode($this->token)
            . '&email=' . urlencode($email);
    }
}
