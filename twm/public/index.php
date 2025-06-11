<?php

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

// configuración de proxies y hosts de confianza
if ($_SERVER['TRUSTED_PROXIES'] ?? false) {
    Request::setTrustedProxies(
        explode(',', $_SERVER['TRUSTED_PROXIES']),
        Request::HEADER_X_FORWARDED_ALL
    );
}

if ($_SERVER['TRUSTED_HOSTS'] ?? false) {
    Request::setTrustedHosts([$_SERVER['TRUSTED_HOSTS']]);
}

return function (array $context) {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
