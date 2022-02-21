const puppeteer = require("puppeteer");
//引入cheerio
const cheerio = require("cheerio");
fs = require("fs");

var fs = require("fs");
const request = require("request");
//save image

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
    });
};

async function getResponseMsg(page) {
    return new Promise((resolve, reject) => {
        page.on('response', response => {
            //console.log("response.url() : " + response.url());
            if (response.url().indexOf('https://seller.shopee.tw/api/marketing/v3/add_on_deal/list') != -1) {
                const req = response.request();
                console.log("Response 的:" + req.method, response.status, req.url);
                let message = response.json();
                message.then(function(result1) {
                    results = result1;
                    resolve(results);
                });
            }

        });
    }).catch(new Function()).then();
}

(async() => {
    console.log("start");
    const browser = await puppeteer.launch({
        args: ["--window-size=1920,1080"],
        defaultViewport: null,
        headless: false,
        userDataDir: "./userData",
        ignoreDefaultArgs: ["--enable-automation"], // headless browser啟動時不顯示自動化測試工具控制中
    });
    const page = await browser.newPage();
    //await page.setRequestInterception(true)
    await page.goto(
        "https://seller.shopee.tw/portal/marketing/add-on-deal/list?status=2&searchType=promotion_name"
    );

    try {
        await page.waitForSelector(
            "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(1) > td.is-first > div > div", { timeout: 600000 }
        );
    } catch (error) {
        console.log("The element didn't appear.");
    }
    getResponseMsg(page);
    // await page.waitForResponse(response => {
    //     console.log(response.url());
    //     if (response.url().indexOf('https://seller.shopee.tw/api/marketing/v3/add_on_deal/list') != -1) {
    //         console.log(response.json());
    //     }
    //     return Promise.resolve();
    // });
    let body = await page.content();
    let $ = await cheerio.load(body);

    let data = [];
    let pageNum = 0;

    while (true) {
        console.log("pageNum: " + pageNum);
        let l = $(
            "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr"
        ).length;
        console.log("items on page: " + l);
        for (let i = 1; i < l + 1; ++i) {
            //$('#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr').each((j, el) => {
            let activeName = $(
                    "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                    i +
                    ") > td.is-first > div > div"
                )
                .text()
                .trim();
            let activeType = $(
                    "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                    i +
                    ") > td:nth-child(2) > div > span"
                )
                .text()
                .trim();
            let activeStatus = $(
                    "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                    i +
                    ") > td:nth-child(5) > div > div"
                )
                .text()
                .trim();
            let fromDate = $(
                    "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                    i +
                    ") > td:nth-child(6) > div > div:nth-child(1)"
                )
                .text()
                .trim();
            let toDate = $(
                "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                i +
                ") > td:nth-child(6) > div > div:nth-child(2)"
            ).text().trim();

            let fileContentArray = activeName.split(/\r\n|\n/);
            activeName = fileContentArray[0];
            let activeData = {
                name: activeName,
                type: activeType,
                status: activeStatus,
                data: fromDate + toDate,
                addOn: {},
            };

            await page.click(
                "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(" +
                i +
                ") > td.is-last > div > div > div:nth-child(1) > div > div.shopee-popover__ref > button > span"
            );

            // ----進入加購商品編輯頁面----
            await page.waitForSelector(
                "#app > div.wrapper > div > div > div:nth-child(3) > div > div.info__view > div > ul.table-body > li > div.item.product.header-column > div > div > div > div > span"
            );
            await page.waitForSelector(
                "#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.table-body > div:nth-child(1) > div.outer-rows > div > div > div > div > div.shopee-popover__ref > span"
            );
            await page.waitForSelector(
                "#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.table-body > div:nth-child(1) > div.inner-rows > ul:nth-child(1) > li.variation.header-column > div > div > span"
            );

            let addOnMainItemData = {
                addOnMainItem: [],
                addOnItems: [],
            };
            bodyAddon = await page.content();
            $addon = await cheerio.load(bodyAddon);
            $addon(
                "#app > div.wrapper > div > div > div:nth-child(3) > div > div.info__view > div > ul.table-body > li"
            ).each((j, el) => {
                const $addOnItem = $addon(el);
                let addOnMainItemTitle = $addOnItem
                    .find(
                        "div.item.product.header-column > div > div > div > div > span"
                    )
                    .text()
                    .trim();
                let img = $addOnItem
                    .find("div.item.product.header-column > img")
                    .attr("src");
                //console.log(img);
                addOnMainItemData.addOnMainItem.push({
                    name: addOnMainItemTitle,
                    img: img,
                });
                //pass to download to download image link is file name and base is base url
                // download(img, addOnMainItemTitle + ".png", function () {
                //     console.log("wao great we done this...THINK DIFFERENT");
                // });
            });
            //console.log("主商品: " + addOnMainItemTitle);

            // ----加購商品----
            while (true) {
                $addon(
                    "#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.table-body > div"
                ).each((j, el) => {
                    const $addOnItem = $addon(el);
                    let addOnItemTitle = $addOnItem
                        .find(
                            "div.outer-rows > div > div > div > div > div > span"
                        )
                        .text()
                        .trim();
                    //console.log("   加購商品: " + addOnItemTitle);
                    let addOnItem = {
                        title: addOnItemTitle,
                        opt: [],
                    };

                    // ----加購商品選項----
                    $addOnItem.find("div.inner-rows > ul").each((j, el2) => {
                        //console.log(el);
                        const $addOnItemOpt = $addon(el2);
                        let order = j;
                        let title = $addOnItemOpt
                            .find(
                                "li.variation.header-column > div > div > span"
                            )
                            .text()
                            .trim();
                        let price = $addOnItemOpt
                            .find("li.input-price.header-column")
                            .text()
                            .trim();
                        let sale = $addOnItemOpt
                            .find("li.addon-price.header-column")
                            .text()
                            .trim();
                        let percent = $addOnItemOpt
                            .find("li.addon-discount.header-column > div")
                            .text()
                            .trim();
                        addOnItem.opt.push({
                            title: title,
                            price: price,
                            sale: sale,
                            percent: percent,
                        });
                    });
                    addOnMainItemData.addOnItems.push(addOnItem);
                });

                //let isLastPage = await page.$('#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.pagination.shopee-pagination > div.shopee-pager.shopee-pagination__part > button.shopee-button.shopee-button--small.shopee-button--frameless.shopee-button--block.shopee-pager__button-next:not([disabled])') !== null;
                let isLastPage =
                    (await page.$(
                        "#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.pagination.shopee-pagination > div.shopee-pager.shopee-pagination__part > button.shopee-button.shopee-button--small.shopee-button--frameless.shopee-button--block.shopee-pager__button-next[disabled]"
                    )) !== null;
                console.log("isLastPage : " + isLastPage);

                if (isLastPage) {
                    break;
                }
                await page.click(
                    "#app > div.wrapper > div > div > div:nth-child(4) > div.sub-item.sub-products > div.info__view > div > div.pagination.shopee-pagination > div.shopee-pager.shopee-pagination__part > button.shopee-button.shopee-button--small.shopee-button--frameless.shopee-button--block.shopee-pager__button-next"
                );

                bodyAddon = await page.content();
                $addon = await cheerio.load(bodyAddon);
            }
            activeData.addOn = addOnMainItemData;
            data.push(activeData);
            console.log(JSON.stringify(activeData));

            await page.goBack();
            await page.waitForSelector(
                "body > div.shopee-modal > div > div > div > div > div.shopee-modal__footer > div > button.shopee-button.shopee-button--primary.shopee-button--normal > span"
            );
            await page.click(
                "body > div.shopee-modal > div > div > div > div > div.shopee-modal__footer > div > button.shopee-button.shopee-button--primary.shopee-button--normal > span"
            );
            try {
                await page.waitForSelector(
                    "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table > div.shopee-table__body-container > div.shopee-table__main-body > div > div > div.shopee-scrollbar__content > table > tbody > tr:nth-child(1) > td.is-first > div > div", { timeout: 600000 }
                );
            } catch (error) {
                console.log("The element didn't appear.");
            }
            body = await page.content();
            $ = await cheerio.load(body);
        }

        await autoScroll(page);
        let isLastActivePage =
            (await page.$(
                "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table.shopee-table--with-append > div.shopee-table__append > div > div > button.shopee-button.shopee-button--small.shopee-button--frameless.shopee-button--block.disabled.shopee-pager__button-next[disabled]"
            )) !== null;
        console.log("isLastActivePage : " + isLastActivePage);

        if (isLastActivePage) {
            break;
        }
        await page.click(
            "#app > div.wrapper > div > div > div > div > div > div.list-card.shopee-card.landing-page-comp._2zaOUn3Zyivml8-HXb4J7v > div > div.landing-page-content.aguth_iEwtiEw1ejuP3Yg > div.shopee-table.table.shopee-table-scrollY.shopee-table--with-append > div.shopee-table__append > div > div > button.shopee-button.shopee-button--small.shopee-button--frameless.shopee-button--block.shopee-pager__button-next"
        );

        body = await page.content();
        $ = await cheerio.load(body);
        pageNum++;
    }

    const fs = require("fs");
    const content = JSON.stringify(data); //轉換成json格式
    fs.writeFile("addon.json", content, "utf8", function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    await page.screenshot({ path: "shop.png" });
    await browser.close();
})();

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

async function autoScroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
