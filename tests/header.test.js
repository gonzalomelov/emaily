const puppeteer = require('puppeteer');
const Keygrip = require('keygrip');
const keys = require('../config/keys');

const DOMAIN = 'http://localhost:3001';
const USER_ID = '64fb617d8e946d05f1ef0275';

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto(DOMAIN);
})

afterEach(async () => {
  await browser.close();
})

test('the header has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  
  expect(text).toEqual('Emaily');
})

test('clicking login starts OAuth flow', async () => {
  await page.click('.right a');
  
  const url = await page.url();
  
  expect(url).toMatch(/accounts\.google\.com/);
})

test.only('when signed in, shows logout button', async () => {
  const passportObject = { passport: { user: USER_ID } };
  const session = require('safe-buffer').Buffer.from(JSON.stringify(passportObject)).toString('base64');
  const keygrip = new Keygrip([keys.cookieKey]);
  const signature = keygrip.sign('session=' + session);
  
  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: signature });
  await page.goto(DOMAIN);
  await page.waitForSelector('a[href="/api/logout"]');

  const text = await page.$eval('a[href="/api/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
})