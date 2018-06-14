const puppeteer = require('puppeteer');

async function run() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	
	await page.goto('https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e');
	await page.screenshot({path: 'screenshots/medium.png', fullPage: true});

	browser.close();
}

run();

