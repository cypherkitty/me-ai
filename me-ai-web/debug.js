const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`Console error: "${msg.text()}"`);
  });
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(3000);
  await browser.close();
})();
