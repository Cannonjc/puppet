const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');

async function run() {
	const pageToClick = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]';
	const select = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select';
	const inputField = 'body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)';
	const linksPath = 'body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table.bodytext > tbody > tr > td:nth-child(1) > a';
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

	const records = await page.$x('//table[2]//tr[td[a]]//td[1]/a');
	console.log(records[0].textContent);
	// const links = await page.$$(linksPath);
	// const linkTest = await page.evaluate(el => el.nodeName, links[0])
	// const linkTest = page.$x('/html/body/table/tbody/tr[2]/td/table/tbody/tr[1]/td/table[2]/tbody/tr[3]/td[1]/a');
	// console.log(links[0]);
	const links = await page.evaluate((selector) => {
		// const node_list = document.querySelectorAll(selector);
		let results = [];
  	let query = document.evaluate(selector,
      document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	  for (let i=0, length=query.snapshotLength; i<length; ++i) {
	    results.push(query.snapshotItem(i).href);
	  }
		// const node_list = $x('//table[2]//tr[td[a]]//td[1]/a');
		// const linksList = [...node_list];
		// return linksList.map(link => link.href);
		// return results.map(link => link.href);
		return results;
	}, linksXPath);
	const basePic = await page.screenshot({fullPage: true});
	let baseBody = await page.evaluate(() => document.body.innerHTML);
	let int = 0;
	for (i = 0; i < links.length; i++) {
		console.log(links[i]);
		await Promise.all([
			page.waitForNavigation(),
			page.goto(links[i])
		]);

		await Promise.all([makeDirectory('screenshots/item'+int), makeDirectory('screenshots/item'+int+'/base'), makeDirectory('screenshots/item'+int+'/record')]);
		let recordPath = "screenshots/item"+int+"/record/record.html";
		let basePath = "screenshots/item"+int+"/base/base.html";
		let basePicPath = "screenshots/item"+int+"/base/base.png";

		await page.screenshot({path: "screenshots/item"+int+"/record/record.png", fullPage: true});
		let recordBody = await page.evaluate(() => document.body.innerHTML);
		await saveFile(recordPath, recordBody);

		await Promise.all([
			page.waitForNavigation(),
			page.goBack()
		]);

		await saveFile(basePath, baseBody);
		await saveFile(basePicPath, basePic);

		int++;
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

async function getLinks(page, selector) {
	const ids = await page.evaluate((selector) => {
		const list = document.querySelectorAll
	})
}

run();
