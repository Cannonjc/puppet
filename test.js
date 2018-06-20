const puppeteer = require('puppeteer');

async function run() {
	const pageToClick = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]';
	const select = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select';
	const inputField = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)';
	const links = 'body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table.bodytext > tbody a';
	const browser = await puppeteer.launch({
		headless: false
	});
	const page = await browser.newPage();
	await page.goto('https://hrlb.oregon.gov/bspa/licenseelookup/');
	await page.select(select, 'lastname');
	await page.focus(inputField);
	await page.keyboard.type('a');
	await Promise.all([
		page.waitForNavigation(),
		page.click(pageToClick)
	]);
	const records = await page.$x('//table[2]//tr[td[a]]');
	for (record in records) {
		console.log(record);
	}
	console.log(records.length);
	const pic = await page.screenshot({fullPage: true});
	await page.close();
	await browser.close();
}

run();
