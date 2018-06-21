const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');

async function run() {
	const pageToClick = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]';
	const select = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select';
	const inputField = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)';
	// const links = 'body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table.bodytext > tbody a';
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

	const records = await page.$x('//table[2]//tr[td[a]]//td[1]/a');
	let int = 0;
	for (let record in records) {
		await Promise.all([
			page.waitForNavigation(),
			page.click(record)
		]);

		await Promise.all([makeDirectory('screenshots/item'+int), makeDirectory('screenshots/item'+int+'/base'), makeDirectory('screenshots/item'+int+'/record')]);
		let recordPath = "screenshots/item"+int+"/record/record.html";
		let basePath = "screenshots/item"+int+"/base/base.html";

		page.screenshot({path: "screenshots/item"+int+"/record/record.png", fullPage: true});
		let recordBody = await page.evaluate(() => document.body.innerHTML);
		await saveHtml(recordPath, recordBody);

		await Promise.all([
			page.waitForNavigation(),
			page.goBack()
		]);

		await page.screenshot({path: "screenshots/item"+int+"/base/base.png", fullPage: true});
		let baseBody = await page.evaluate(() => document.body.innerHTML);
		await saveHtml(basePath, baseBody);

		int++;
		console.log(record);
	}
	await Promise.all([makeDirectory('screenshots/item'+int), makeDirectory('screenshots/item'+int+'/base'), makeDirectory('screenshots/item'+int+'/record')]);
	await page.screenshot({path: "screenshots/item"+int+"/base/base.png", fullPage: true});
	let baseBody = await page.evaluate(() => document.body.innerHTML);
	await fs.writeFile("screenshots/item"+int+"/base/base.html", baseBody, (err) => {
		if (err) throw err;
	});
	await page.close();
	await browser.close();
}

async function makeDirectory(path) {
	mkdirp(path, function(err) {
		if (err) throw err;
	});
};

async function saveHtml(path, html) {
	await fs.writeFile(path, html, (err) => {
		if (err) throw err;
	});
};

run();
