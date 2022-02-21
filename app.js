const puppeteer = require('puppeteer');
//引入cheerio
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    let data = [];
    let pageNum = 1, pageLen = 0;
    while (true) {
        // https://javdb.com/actors/bvWB?page=1
        let url = 'https://javdb.com/actors/bvWB?page=' + pageNum;
        await page.goto(url);
        await page.waitForSelector('section')
        let body = await page.content()
        let $ = await cheerio.load(body)//我們把cheerio找到的資料轉成文字並存進data這個變數

        // 取得最大頁數
        if (pageLen === 0) {
            pageLen = $('.pagination-list').find('li').length;
        }

        $('#videos > div > div').each((j, el) => {
            const $el = $(el);
            let order = j;
            //text是抓取文字, trim是去頭尾空字串
            let uid = (pageNum - 1) * 40 + order;
            let number = $el.find('a > div.uid').text().trim();
            let title = $el.find('a > div.video-title').text().trim();
            let href = $el.find('a').attr('href');
            let tmp = {
                uid: uid,
                pageNum: pageNum,
                order: order,
                number: number,
                title: title,
                href: href
            }
            data.push(tmp)
        })
        pageNum++;

        if (pageNum > pageLen) {
            break;
        }
    }

    const fs = require('fs');
    const content = JSON.stringify(data); //轉換成json格式
    fs.writeFile("javdb.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    console.table(data)
    console.log("end: " + data.length)
    await browser.close()
})();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
