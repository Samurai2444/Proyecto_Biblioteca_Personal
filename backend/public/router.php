<?php

declare(strict_types=1);

/**
 * Router para php -S: enruta a index.php; sirve solo ficheros reales bajo public/.
 */
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
$uri = str_replace("\0", '', $uri);
if (!str_starts_with($uri, '/')) {
    $uri = '/'.$uri;
}

$public = realpath(__DIR__) ?: __DIR__;
$path = realpath($public.$uri);

if ($uri !== '/' && $path && str_starts_with($path, $public) && is_file($path)) {
    return false;
}

$_SERVER['SCRIPT_FILENAME'] = $public.'/index.php';

require $public.'/index.php';
