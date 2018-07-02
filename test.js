const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');

async function run() {
	const pageToClick = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]';
	const select = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select';
	const inputField = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)';
	const linksXPath = '//table[2]//tr[td[a]]//td[1]/a';
	const browser = await puppeteer.launch({
		headless: true
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

	const links = await page.evaluate((selector) => {
		let results = [];
  	let query = document.evaluate(selector,
      document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  for (let i=0, length=query.snapshotLength; i<length; ++i) {
	    results.push(query.snapshotItem(i).href);
	  }
		return results;
	}, linksXPath);
	const basePic = await page.screenshot({fullPage: true});
	let baseBody = await page.content();
	let int = 0;
	for (i = 0; i < links.length; i++) {
		await Promise.all([
			page.waitForNavigation(),
			page.goto(links[i])
		]);

		await Promise.all([makeDirectory('screenshots/item'+int), makeDirectory('screenshots/item'+int+'/base'), makeDirectory('screenshots/item'+int+'/record')]);
		let recordPath = "screenshots/item"+int+"/record/record.html";
		let basePath = "screenshots/item"+int+"/base/base.html";
		let basePicPath = "screenshots/item"+int+"/base/base.png";

		await page.screenshot({path: "screenshots/item"+int+"/record/record.png", fullPage: true});
		let recordBody = await page.content();
		await saveFile(recordPath, recordBody);

		await Promise.all([
			page.waitForNavigation(),
			page.goBack()
		]);

		await saveFile(basePath, baseBody);
		await saveFile(basePicPath, basePic);

		int++;
		let used = process.memoryUsage().heapUsed / 1024 / 1024;
		console.log("This script is currently using: " + Math.round(used * 100)/100 + "MB");
	};
	await page.close();
	await browser.close();
}

async function makeDirectory(path) {
	mkdirp(path, function(err) {
		if (err) throw err;
	});
};

async function saveFile(path, html) {
	await fs.writeFile(path, html, (err) => {
		if (err) throw err;
	});
};

run();
