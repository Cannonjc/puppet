const puppeteer = require('puppeteer');

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
	const links = await page.evaluate(() => {
		const records = document.evaluate('//table[2]//tr[td[a]]', document, null, XPathResult.ANY_TYPE, null);
		// records = document.$x('//table[2]//tr[td[a]]');
		return records
		// return records.map(record => record.getElementsByTagName('td')[0].children[0]);
	})
	console.log("--------");
	console.log(links.length);
	console.log("--------");
	for (let linc in links) {
		console.log(linc);
	}
	console.log(links.length);
	const pic = await page.screenshot({fullPage: true});
	await page.close();
	await browser.close();
}

run();
