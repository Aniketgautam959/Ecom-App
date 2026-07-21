<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'razorpay' => [
        'key'    => env('RAZORPAY_KEY'),
        'secret' => env('RAZORPAY_SECRET'),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
    ],

    'delhivery' => [
        'api_key' => env('DELHIVERY_API_KEY'),
        'api_url' => env('DELHIVERY_API_URL', 'https://track.delhivery.com'),
        'pickup_location' => env('DELHIVERY_PICKUP_LOCATION', 'Primary'),
        'shipper_name' => env('DELHIVERY_SHIPPER_NAME'),
        'shipper_address' => env('DELHIVERY_SHIPPER_ADDRESS'),
        'shipper_city' => env('DELHIVERY_SHIPPER_CITY'),
        'shipper_state' => env('DELHIVERY_SHIPPER_STATE'),
        'shipper_pin' => env('DELHIVERY_SHIPPER_PIN'),
        'shipper_phone' => env('DELHIVERY_SHIPPER_PHONE'),
    ],

];
