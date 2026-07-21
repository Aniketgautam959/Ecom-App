<?php

namespace App\Exceptions\Auth;

use Exception;

class InvalidCredentialsException extends Exception
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? 'The provided credentials are incorrect.');
    }
}
