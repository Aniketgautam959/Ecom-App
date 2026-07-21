<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        body {
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .login-card {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            width: 100%;
            max-width: 384px;
            padding: 48px 40px;
        }
        .admin-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 40px;
        }
        .admin-logo-icon {
            width: 36px;
            height: 36px;
            background: #111;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .admin-logo-icon svg {
            width: 18px;
            height: 18px;
            fill: #fff;
        }
        .admin-logo-text {
            font-size: 22px;
            font-weight: 700;
            color: #111;
            letter-spacing: -0.3px;
        }
        .form-label {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
        }
        .form-control {
            border: 1px solid #d1d1d1;
            border-radius: 6px;
            padding: 10px 14px;
            font-size: 14px;
            color: #111;
            background: #fff;
            transition: border-color 0.15s;
        }
        .form-control:focus {
            border-color: #111;
            box-shadow: none;
            outline: none;
        }
        .form-control.is-invalid {
            border-color: #dc3545;
        }
        .btn-login {
            width: 100%;
            background: #111;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.15s;
        }
        .btn-login:hover {
            background: #333;
        }
        .alert-danger {
            font-size: 13px;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 20px;
        }
        .register-link {
            text-align: center;
            margin-top: 20px;
            font-size: 13px;
            color: #666;
        }
        .register-link a {
            color: #111;
            font-weight: 600;
            text-decoration: none;
        }
        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-card">

        {{-- Admin Logo --}}
        <div class="admin-logo">
            <div class="admin-logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>
            <span class="admin-logo-text">Admin</span>
        </div>

        {{-- Errors --}}
        @if (session('status'))
            <div class="alert alert-success" style="font-size:13px; border-radius:6px;">{{ session('status') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        {{-- Form --}}
        <form method="POST" action="{{ route('admin.login') }}">
            @csrf

            <div class="mb-3">
                <label for="email_id" class="form-label">Email</label>
                <input id="email_id" type="email" name="email_id"
                       value="{{ old('email_id') }}"
                       class="form-control @error('email_id') is-invalid @enderror"
                       required autofocus autocomplete="username">
                @error('email_id')
                    <div class="invalid-feedback" style="font-size:12px;">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input id="password" type="password" name="password"
                       class="form-control @error('password') is-invalid @enderror"
                       required autocomplete="current-password">
                @error('password')
                    <div class="invalid-feedback" style="font-size:12px;">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit" class="btn-login">Login</button>
        </form>

        <div class="register-link">
            Don't have an account? <a href="{{ route('admin.register') }}">Register</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
