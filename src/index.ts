import puppeteer from "puppeteer";
import fs from "fs";

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const website = await browser.newPage();

  for (let i = 0; i < 9; i++) {
    const pgNum: number = i + 1;
    let websiteURL: string =
      "https://www.ebay.com/sch/i.html?_from=R40&_nkw=mizuno+jpx+923+hot+metal&_sacat=0&_pgn=";
    websiteURL += `${pgNum}`;
    await website.goto(websiteURL);
    const titles = await website.$$(
      "div > div.s-item__info.clearfix > a > div > span"
    );

    const prices = await website.$$(
      "div > div.s-item__info.clearfix > div.s-item__details.clearfix > div:nth-child(1) > span"
    );

    const titlesArr = [];
    const pricesArr = [];
    for (let i = 0; i < titles.length; i++) {
      const titleContent = await titles[i].getProperty("textContent");
      const title = await titleContent.jsonValue();
      const priceContent = await prices[i].getProperty("textContent");
      let price = await priceContent.jsonValue();
      const priceInt = parseInt(
        price?.replace("$", "").replace(",", "") || "0"
      );

      if (priceInt < 800 && priceInt > 200) {
        titlesArr.push(title);
        pricesArr.push(price);
        const entry = `${title},${price}\n`;
        fs.appendFile("golfPrices.csv", entry, (error) => {});
      }
    }
  }
  // #item2b60f0f599 > div > div.s-item__info.clearfix > a > div > span
  // #item2b60f0f599 > div > div.s-item__info.clearfix > div.s-item__details.clearfix > div:nth-child(1) > span
};
main();
