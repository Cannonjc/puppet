const puppeteer = require('puppeteer');

async function run() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e');
	await page.screenshot({path: 'screenshots/medium.png', fullPage: true});

	browser.close();
}

run();
const test = await page.$x(`//td[select]/select`);
const text = await page.evaluate(el => {
	return el;
}, test);
console.log(text);
// const links = await page.evaluate(() => {
// 	const records = document.evaluate('//table[2]//tr[td[a]]', document, null, XPathResult.ANY_TYPE, null);
// 	// records = document.$x('//table[2]//tr[td[a]]');
// 	return records
// 	// return records.map(record => record.getElementsByTagName('td')[0].children[0]);
// })
// for (let linc in links) {
// 	console.log(linc);
// }
