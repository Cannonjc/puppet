const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e');
	await page.screenshot({path: 'screenshots/medium.png', fullPage: true});
	let html = await page.content();
	await fs.writeFile('screenshots/myPage.html', html, (err) => {
		if (err) throw err;
	});

	browser.close();
}

run();
