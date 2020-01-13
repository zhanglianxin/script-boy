<?php

namespace App;

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class MyLog
{
    private function __construct()
    {
    }

    public static function getInstance()
    {
        static $l;
        if (!$l) {
            $l = new Logger('local');
            $l->pushHandler(new StreamHandler('php://stdout'), Logger::WARNING);
        }
        return $l;
    }
}
