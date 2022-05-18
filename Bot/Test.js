const puppeteer = require('puppeteer');

(async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto('http://127.0.0.1:5500/index.html');
   const data = await page.evaluate(() => {
       const items = document.getElementsByTagName('span')
return items
   });
   //await page.screenshot({path: 'oxylabs_1080.png'})
  await console.log(data[0].textContent)
 await browser.close();
})();
