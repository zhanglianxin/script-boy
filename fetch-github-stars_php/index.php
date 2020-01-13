<?php

use App\MyFile as MyFileAlias;
use App\MyLog as MyLogAlias;
use App\MyParser as MyParserAlias;

require __DIR__ . '/vendor/autoload.php';

$argc < 2 && exit('Missing parameters.' . PHP_EOL);

function fetchReposData(string $username): array
{
    $nextPage = 'https://github.com/' . $username . '?tab=stars';
    $pageIdx = 0;
    $repos = [];
    $isLast = false;
    for (; !$isLast; $pageIdx++) {
        $p = new MyParserAlias(curl_get($nextPage));
        $isLast = $p->isLastPage();
        $nextPage = $p->getNextPage();
        $pageRepos = $p->getPageRepos();
        $repos = [...$repos, ...$pageRepos];
        MyLogAlias::getInstance()->info('current', [
            'pageIdx' => $pageIdx, 'count' => count($pageRepos),
        ]);
        usleep(mt_rand(1e6, 1.5e6));
    }
    return compact('repos', 'pageIdx');
}

$reposData = fetchReposData($argv[1]);

$fs = MyFileAlias::getInstance();
$fileName = 'github-stars-data.csv';
$headers = 'name,link,desc,lang,star,fork,updatedAt';
$fs->has($fileName) ? $fs->update($fileName, csv_out($headers, $reposData['repos']))
    : $fs->write($fileName, csv_out($headers, $reposData['repos']));
