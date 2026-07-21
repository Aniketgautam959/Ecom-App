<?php

namespace App\Exceptions\Auth;

use Exception;

class PasswordResetException extends Exception
{
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
