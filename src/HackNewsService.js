const puppeteer = require('puppeteer');

class HackNewsService {
    async hNewsTopList(data) {
        const browser = await puppeteer.launch({
            headless: "new", args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
            ]
        });
        const page = await browser.newPage();
        let url = 'https://news.ycombinator.com/news';
        if (data && data.hasOwnProperty('p')) {
            if (Number(data.p) > 1) url = `https://news.ycombinator.com/news?p=${data.p}`
        }
        // console.log("We are scraping from " + url);
        await page.goto(url);
        try {
            await page.waitForSelector('.titleline');
            const specificClassSpanContents = await page.evaluate(() => {
                const articles = Array.from(document.querySelectorAll('.athing'));
                if (!articles) return [];
                return articles.map(article => {
                    const titleLine = article.querySelector('.titleline');
                    const subline = article.nextElementSibling.querySelector('.subline');
                    if (!titleLine) return null;
                    const title = titleLine.textContent.trim();
                    const link = titleLine.querySelector('a') ? titleLine.querySelector('a').getAttribute('href') : 'No link';
                    if (!subline) return { title: title, link: link, points: 0, comments: 0, commentsHref: false };
                    const pointsElement = subline.querySelector('.score');
                    const points = pointsElement ? parseInt(pointsElement.textContent.trim().replace(/\D/g, ''), 10) : 0;
                    const commentsLink = Array.from(subline.querySelectorAll('a[href*="item?id="]')).find(a => a.textContent.includes('comments'));
                    const comments = commentsLink ? parseInt(commentsLink.textContent.trim().replace(/\D/g, ''), 10) : 0;
                    const commentsHref = commentsLink ? commentsLink.getAttribute('href') : false;
                    return { title: title, link: link, points: Number(points), comments: Number(comments), commentsHref: commentsHref };
                }).filter(item => item !== null);
            });
    
            await browser.close();
            return specificClassSpanContents;
        } catch (error) {
            console.error("An error occurred, will retry,", error.message);
            return [];
        }
    }

    async hNewsNewestList(data) {
        const browser = await puppeteer.launch({
            headless: "new", args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
            ]
        });
        const page = await browser.newPage();
        let url = 'https://news.ycombinator.com/newest';
        let index = 0;
        if (data && data.hasOwnProperty('p')) {
            if (data.p) url = `https://news.ycombinator.com/${data.p}`
        }
        if (data && data.hasOwnProperty('index')) {
            if (Number(data.index) > 10) return { message: 'will end now' }
            index = Number(data.index) + 1;
        }
        else {
            index += 1;
        }
        // console.log("We are scraping from " + url + ":" + 'index==' + index);
        try {
            await page.goto(url);
            console.log(`with page index = ${index}`);
            await page.waitForSelector('.morelink');
            const moreLinkStr = await page.$eval('.morelink', el => el.getAttribute('href'));
            // console.log(moreLinkStr);// newest?next=38877115&n=31
            const specificClassSpanContents = await page.evaluate(() => {
                const spans = Array.from(document.querySelectorAll('.titleline'));
                if (!spans) return [];
                return spans.map(span => ({ 'title': span.textContent, link: span.querySelector('a').getAttribute('href') }));
            });
            await browser.close();
            let interpolation = {
                p: moreLinkStr,
                index: index,
                type: 'next'
            }
            specificClassSpanContents.push(interpolation);
            return specificClassSpanContents;
        } catch (error) {
            console.error("An error occurred, will retry,", error.message);
            return []
        }
    }

    async hackerNewsComnents(data) {
        if (!data.hasOwnProperty('commentsHref')) return [];
        const browser = await puppeteer.launch({
            headless: "new",
        });
        const page = await browser.newPage();
        await page.goto(`https://news.ycombinator.com/${data.commentsHref}`);
        const comments = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.comtr'));
            let comments = [];
            let stack = [comments];
            rows.forEach(row => {
                const author = row.querySelector('.hnuser')?.innerText;
                const time = row.querySelector('.age a')?.innerText;
                let commentTextElement = row.querySelector('.commtext');
                let commentText = commentTextElement?.innerText.replace(/\s\s+/g, ' ').trim() || "comments deleted";    
                let links = commentTextElement?.querySelectorAll('a');
                links?.forEach(link => {
                    const href = link.href;
                    const linkText = link.innerText;
                    commentText = commentText.replace(linkText, `(${href})`);
                });
    
                const indentLevel = parseInt(row.querySelector('.ind img')?.width / 40, 10);
                const comment = { author, time, commentText, replies: [] };
                while (indentLevel < stack.length - 1) {
                    stack.pop();
                }
                if (indentLevel === stack.length - 1) {
                    stack[indentLevel].push(comment);
                    stack.push(comment.replies);
                } else {
                    console.error('Indentation error', { comment, indentLevel, stackLength: stack.length });
                }
            });
    
            return comments;
        });
        await browser.close();
        return comments;
    }


    async webRawContent(fileURL,isHeadless="new"){
        const browser = await puppeteer.launch({
            headless: isHeadless,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
            ]
            // executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        });
        let webDetail = {
            content:"",
            keywords:"",
            summary:"",
            top_image:""
        }
        try {
            const page = (await browser.pages())[0];
            // await page.setUserAgent(this.randomUAHeader()); // No randomUAHeader function in the provided code. Removed it.
            await page.goto(fileURL);
            const extractedText = await page.$eval('*', (el) => el.innerText);
            webDetail.content   = extractedText;
            return webDetail;
        } catch (error) {
            console.error("An error occurred, will use no headless browser,", error.message, fileURL, JSON.stringify(webDetail));
            if(webDetail.content.length > 100)
            {
                console.error(`Already fetch the Content, will return`,fileURL);
                return webDetail;
            }
            if(!isHeadless)
            {
                console.error(`use no headless browser also get no content!!!`, error.message, fileURL);
                return webDetail;
            }
            return await this.webPage2Text1(fileURL,false);
        }finally{
            await browser.close();
        }
    }
}

module.exports = new HackNewsService();
