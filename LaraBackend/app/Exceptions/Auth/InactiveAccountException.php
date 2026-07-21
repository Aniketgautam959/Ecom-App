<?php

namespace App\Exceptions\Auth;

use Exception;

class InactiveAccountException extends Exception
{
    public function __construct()
    {
        parent::__construct('Your account is inactive. Please contact support.');
    }
}
