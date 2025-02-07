const puppeteer = require('puppeteer');

class HackNewsService {
    async hNewsTopList(data) {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        let url = 'https://news.ycombinator.com/news';
        if (data && data.p && Number(data.p) > 1) {
            url = `https://news.ycombinator.com/news?p=${data.p}`;
        }
        // console.log("Scraping from:", url);
        await page.goto(url);
        try {
            await page.waitForSelector('.titleline');
            const articles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.athing')).map(article => {
                    const titleLine = article.querySelector('.titleline');
                    const subline = article.nextElementSibling.querySelector('.subline');
                    const title = titleLine ? titleLine.textContent.trim() : 'No title';
                    const link = titleLine && titleLine.querySelector('a') ? titleLine.querySelector('a').href : 'No link';
                    const points = subline?.querySelector('.score')?.textContent.match(/\d+/)?.[0] || 0;
                    const commentsLink = Array.from(subline.querySelectorAll('a')).find(a => a.textContent.includes('comment'));
                    const comments = commentsLink ? parseInt(commentsLink.textContent.match(/\d+/)?.[0] || 0) : 0;
                    const commentsHref = commentsLink ? commentsLink.href : null;

                    return { title, link, points: Number(points), comments, commentsHref };
                });
            });
            await browser.close();
            return articles;
        } catch (error) {
            console.error("Error:", error.message);
            await browser.close();
            return [];
        }
    }

    async hNewsNewestList(data) {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox',
                '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process',
            ]
        });

        const page = await browser.newPage();
        let url = 'https://news.ycombinator.com/newest';
        let index = data.index || 1;  // Default to 1 if index isn't provided

        // If nextPage token is provided, modify the URL
        if (data.nextPage) {
            url = `https://news.ycombinator.com/${data.nextPage}`;
        }

        // console.log(`Scraping from: ${url} (Page ${index})`);

        try {
            await page.goto(url);
            await page.waitForSelector('.morelink');

            // Extract the articles
            const articles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.athing')).map(article => {
                    const titleLine = article.querySelector('.titleline');
                    const subline = article.nextElementSibling.querySelector('.subline');
                    const title = titleLine ? titleLine.textContent.trim() : 'No title';
                    const link = titleLine?.querySelector('a')?.href || 'No link';
                    const points = subline?.querySelector('.score')?.textContent.match(/\d+/)?.[0] || 0;
                    const commentsLink = Array.from(subline.querySelectorAll('a')).find(a => a.textContent.includes('comment'));
                    const comments = commentsLink ? parseInt(commentsLink.textContent.match(/\d+/)?.[0] || 0) : 0;
                    const commentsHref = commentsLink ? commentsLink.href : null;

                    return { title, link, points: Number(points), comments, commentsHref };
                });
            });

            // Get the next page token
            const nextPageToken = await page.$eval('.morelink', el => el.getAttribute('href'));

            await browser.close();

            // Return articles along with the nextPage token and index
            return {
                articles,
                nextPage: nextPageToken,
                index: index + 1
            };

        } catch (error) {
            console.error("An error occurred:", error.message);
            await browser.close();
            return { articles: [], nextPage: null, index };
        }
    }
}

module.exports = new HackNewsService();
