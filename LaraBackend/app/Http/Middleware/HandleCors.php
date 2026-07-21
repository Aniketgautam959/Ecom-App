<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    public function handle(Request $request, \Closure $next): Response
    {
        $response = $next($request);

        $configuredOrigin = env('FRONTEND_URL', 'http://localhost:3000');
        $requestOrigin = $request->headers->get('Origin');
        $origin = $requestOrigin && preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $requestOrigin)
            ? $requestOrigin
            : $configuredOrigin;

        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
