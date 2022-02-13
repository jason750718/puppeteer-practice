const puppeteer = require('puppeteer');
//引入cheerio
const cheerio = require('cheerio');
(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://javdb.com/actors/bvWB');

    //先等待網頁載入到底下的section的html標籤，不然有時候執行太快抓不到網頁
    await page.waitForSelector('section')

    //把網頁的body抓出來
    let body = await page.content()

    //接著我們把他丟給cheerio去處理
    let $ = await cheerio.load(body)

    let data = [];
    //我們把cheerio找到的資料轉成文字並存進data這個變數
    await $('#videos > div > div').each(async (i, el) => {
        if (i === 0) {
            start_time = new Date().getTime();
            console.log("delay!!!!!")
            await delay(5000);
            end_time = new Date().getTime();
            console.log((end_time - start_time) / 1000 + "sec");
        }
        console.log("i: " + i);
        let $2 = cheerio.load($(el).html());

        //text是抓取文字, trim是去頭尾空字串
        let number = $2('a > div.uid').text().trim();
        //let title = $2('a > div.video-title').text().trim();
        let title = "";
        let href = $2('a').attr('href');
        let tmp = {
            order: i,
            number: number,
            title: title,
            href: href
        }
        data.push(tmp)
        console.log("data.length : " + data.length)
    })
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
    //並再終端機print出來
    //console.log(data)
    //console.log("main proc");

    await browser.close()
})();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}