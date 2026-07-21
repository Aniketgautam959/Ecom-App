<?php

namespace App\Exceptions\Category;

use Exception;

class CategoryNotFoundException extends Exception
{
    public function __construct(?string $message = null)
    {
        parent::__construct($message ?? 'Category not found.');
    }
}
