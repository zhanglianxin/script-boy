// ==UserScript==
// @name         github-stars
// @namespace    https://coolman.site/
// @version      0.1
// @description  try to take over the world!
// @author       zhanglianxin
// @match        https://github.com/zhanglianxin?*tab=stars
// https://github.com/zhanglianxin?tab=stars
// https://github.com/zhanglianxin?after=Y3Vyc29yOnYyOpK5MjAxOS0xMi0wMlQwMDozNzo1NCswODowMM4Lu6os&tab=stars
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
    const traverse = (i) => {
        console.log('---traverse---');
        let page = [];
        const repos = document.querySelectorAll('.py-4');
        for (let r of repos) {
            let name = r.querySelector('.mb-1').innerText;
            let link = r.querySelector('.mb-1 a').href;
            let desc = r.querySelector('.py-1').innerText;
            const langElem = r.querySelector('.f6 > .ml-0');
            let lang = langElem ? langElem.innerText.trim() : '';
            const starSvgElem = r.querySelector('.f6 svg[aria-label=star]')
            let star = starSvgElem ? starSvgElem.parentElement.innerText.replace(/,|\s/g, '') : 0;
            const forkSvgElem = r.querySelector('.f6 svg[aria-label=fork]');
            let fork = forkSvgElem ? forkSvgElem.parentElement.innerText.replace(/,|\s/g, '') : 0;
            let updatedAt = r.querySelector('.f6 > relative-time').getAttribute('datetime');
            page.push(new Repo(name, link, desc, lang, +star, +fork, updatedAt));
        }
        localStorage.setItem(`page-${ i }`, JSON.stringify(page));
    };
    const getRndInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    const isLast = () => {
        console.log('---isLast---');
        const btn = document.querySelector('.paginate-container button[disabled]');
        return btn && 'Next' == btn.textContent;
    };
    const control = () => {
        console.log('---control---');
        const nextBtn = document.querySelector('.paginate-container a:last-of-type');
        nextBtn && nextBtn.click();
    };

    const k = `stars-last-page`;
    let curPage = localStorage.getItem(k);
    curPage = curPage ? curPage : 0;
    traverse(curPage);
    setTimeout(() => {
        console.log('---in setTimeout callback---');
        if (!isLast()) {
            control();
            localStorage.setItem(k, +curPage + 1);
        } else {
            console.info('===DONE===');
            setTimeout(() => {
                location.href = 'https://github.com/zhanglianxin';
            }, 3000);
        }
    }, getRndInteger(3000, 5000));
})();
