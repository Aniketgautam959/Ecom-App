<?php

namespace App\Exceptions\Brand;

use Exception;

class BrandNotFoundException extends Exception
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? 'Brand not found.');
    }
}
