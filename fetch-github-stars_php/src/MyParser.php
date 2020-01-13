<?php

namespace App;

use voku\helper\HtmlDomParser;

class MyParser
{
    private HtmlDomParser $dom;

    public function __construct(string $str)
    {
        $this->dom = HtmlDomParser::str_get_html($str);
    }

    public function isFirstPage(): bool
    {
        $dom = $this->dom->findOne('.paginate-container button[disabled]');
        return $dom->plaintext == 'Previous';
    }

    public function isLastPage(): bool
    {
        $dom = $this->dom->findOne('.paginate-container button[disabled]');
        return $dom->plaintext == 'Next';
    }

    public function getNextPage(): string
    {
        $dom = $this->dom->findOne('.paginate-container a:last-of-type');
        return $dom->getAttribute('href') ?? '';
    }

    public function getPrevPage(): string
    {
        $dom = $this->dom->findOne('.paginate-container a:first-of-type');
        return $dom->getAttribute('href') ?? '';
    }

    public function getPageRepos(): array
    {
        $repos = [
            // 'name' => '',
            // 'link' => '',
            // 'desc' => '',
            // 'lang' => '',
            // 'star' => 0,
            // 'fork' => 0,
            // 'updatedAt' => '',
        ];
        foreach ($this->dom->findMulti('div.py-4') as $domElement) {
            $name = $domElement->findOne('.mb-1')->plaintext;
            $link = 'https://github.com' . $domElement->findOne('.mb-1 a')->getAttribute('href');
            $desc = $domElement->findOne('.py-1')->plaintext;
            $langContent = $domElement->findOneOrFalse('.f6 > .ml-0');
            $lang = $langContent ? trim($langContent->plaintext) : '';
            $starContent = $domElement->findOneOrFalse('.f6 svg[aria-label=star]');
            $star = $starContent ? (int)preg_replace('/,|\s/',
                '', $starContent->parentNode()->plaintext) : 0;
            $forkContent = $domElement->findOneOrFalse('.f6 svg[aria-label=fork]');
            $fork = $forkContent ? (int)preg_replace('/,|\s/',
                '', $forkContent->parentNode()->plaintext) : 0;
            $updatedAt = $domElement->findOne('.f6 > relative-time')->getAttribute('datetime');
            $repos[] = compact('name', 'link', 'desc', 'lang', 'star', 'fork', 'updatedAt');
        }
        return $repos;
    }
}
