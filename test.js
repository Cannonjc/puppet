const puppeteer = require('puppeteer');

async function run() {
	const height = 1600;
	const width = 1400;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({ width, height })
	const pageToClick = '#content > div > div.search-results > div:nth-child(6) > h2 >a';
	await page.goto('https://www.gov.im/categories/tax-vat-and-your-money/customs-and-excise/news/');
	await Promise.all([
		page.waitForNavigation(),
		page.click(pageToClick)
	]);
	await page.screenshot({path: 'screenshots/gov.png', fullPage: true});
	await page.close();
	await browser.close();
}

run();
