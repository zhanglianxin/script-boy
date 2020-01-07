// ==UserScript==
// @name         github-stars-data
// @namespace    https://coolman.site/
// @version      0.1
// @description  try to take over the world!
// @author       zhanglianxin
// @match        https://github.com/zhanglianxin
// @grant        none
// ==/UserScript==

(() => {
    console.log('hello there!');
    // Your code here...
    class Repo {
        constructor(name, link, desc, lang, star, fork, updatedAt) {
            this.name = name;
            this.link = link;
            this.desc = desc;
            this.lang = lang;
            this.star = star;
            this.fork = fork;
            this.updatedAt = updatedAt;
        }
    }

    const mdStr = (arr) => {
        if (arr.length > 0) {
            let fields = [];
            let fields2 = [];
            for (let i in arr[0]) {
                fields.push(i);
                fields2.push('---');
            }
            let header = '| ' + fields.join(' | ') + ' |\n';
            let delimiter = '| ' + fields2.join(' | ') + ' |\n'
            let data = '';
            for (let o of arr) {
                let row = [];
                for (let field of fields) {
                    row.push(o[field]);
                }
                data += '| ' + row.join(' | ') + ' |\n';
            }

            return header + delimiter + data;
        }
    };
    const csvStr = (arr) => {
        if (arr.length > 0) {
            let fields = [];
            for (let i in arr[0]) {
                fields.push(i);
            }
            let header = fields.join(',') + '\n';
            let data = '';
            for (let o of arr) {
                let row = [];
                for (let field of fields) {
                    row.push(`"${ ('' + o[field]).replace(/\"/g, '""') }"`);
                }
                data += row.join(',') + '\n';
            }
            return header + data;
        }
    };
    const jsonStr = (arr) => {
        return JSON.stringify(arr);
    };
    // https://www.zhangxinxu.com/wordpress/2017/07/js-text-string-download-as-html-json-file/
    // https://segmentfault.com/a/1190000011563430
    const download = (content, filename) => {
        let a = document.createElement('a');
        a.download = filename;
        let b;
        if (filename.endsWith('.json')) {
        } else if (filename.endsWith('.csv')) {
        } else if (filename.endsWith('.md')) {
        }
        let found = filename.match(/\.\w{1,4}$/);
        if (!found) {
            return;
        }
        switch (found[0]) {
            case '.json':
                b = new Blob([jsonStr(content)], {
                    type: 'application/json',
                });
                break;
            case '.csv':
                b = new Blob([csvStr(content)], {
                    type: 'text/csv',
                });
                break;
            case '.md':
                b = new Blob([mdStr(content)], {
                    type: 'text/plain',
                });
                break;
            default:
                console.error('unsupported filetype');
                break;
        }
        if (!b) {
            return;
        }
        a.href = URL.createObjectURL(b);
        a.click();
    };

    const gitHubHome = 'https://github.com/zhanglianxin';
    !(gitHubHome == location.href) && (location.href = gitHubHome);
    const k = `stars-last-page`;
    let lastPage = localStorage.getItem(k);
    if (null != lastPage ) {
        let all = [];
        for (let i = 0; i <= +lastPage; i++) {
            const p = `page-${ i }`;
            let obj = JSON.parse(localStorage.getItem(p));
            obj && all.push(...obj);
            // localStorage.removeItem(p);
            console.info(i, obj);
        }
        localStorage.removeItem(k);
        all.length > 0 && download(all, 'github-stars-data.json');
    } else {
        console.error('retrieve first');
    }
})();
