const puppeteer = require('puppeteer');
const fs = require('fs');

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
	let int = 0;
	for (record in records) {
		// await Promise.all([
		// 	page.waitForNavigation(),
		// 	page.click(record)
		// ]);
		// page.screenshot({path: "screenshots/item"+int+"/record/record.png"}, fullPage: true)
		// let recordBody = await page.evaluate(() => document.body.innerHTML);
		// write recordBody to file with same path.
		// await Promise.all([
		// 	page.waitForNavigation(),
		// 	page.goBack()
		// ]);
		// await page.screenshot({path: "screenshots/item"+int+"/base/base.png", fullPage: true});
		// let baseBody = await page.evaluate(() => document.body.innerHTML);
		// write baseBody to file with same path
		// int++;
		console.log(record);
	}
	console.log(records.length);
	await page.screenshot({path: "screenshots/screen.png", fullPage: true});
	let baseBody = await page.evaluate(() => document.body.innerHTML);
	await fs.writeFile("screenshots/body.html", baseBody, (err) =>)
	await page.close();
	await browser.close();
}

run();
