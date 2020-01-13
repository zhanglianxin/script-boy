<?php

if (!function_exists('curl_get')) {
    function curl_get(string $url): string
    {
        $ch = curl_init($url);

        if (!ini_get('open_basedir')) {
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.42 Safari/537.36');
        curl_setopt($ch, CURLOPT_URL, $url);

        $content = curl_exec($ch);
        if ($content === false) {
            // there was a problem
            $error = curl_error($ch);
            $msg = 'Error retrieving "' . $url . '" (' . $error . ')';
            \App\MyLog::getInstance()->error($msg);
            throw new Exception($msg);
        }

        return $content;
    }
}

if (!function_exists('csv_out')) {
    function csv_out(string $headers, array $data): string
    {
        if (!count($data)) return '';
        $result = $headers . PHP_EOL;
        $headersArr = explode(',', $headers);
        foreach ($data as $one) {
            $line = [];
            foreach ($headersArr as $columnName) {
                $line = [...$line, str_replace('"', '""', $one[$columnName])];
            }
            $result .= '"' . implode('","', $line) . '"' . PHP_EOL;
        }
        return $result;
    }
}
