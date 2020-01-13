<?php

namespace App;

use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;

class MyFile
{
    private function __construct()
    {
    }

    public static function getInstance()
    {
        static $fs;
        if (!$fs) {
            $adapter = new Local(__DIR__ . '/../');
            $fs = new Filesystem($adapter);
        }
        return $fs;
    }
}
