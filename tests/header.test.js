const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

const DOMAIN = 'http://localhost:3001';

let browser, page;

async function authenticate() {
  const user = await userFactory();
  const session = sessionFactory(user._id);
  
  await page.setCookie({ name: 'session', value: session.session });
  await page.setCookie({ name: 'session.sig', value: session.sig });
  await page.goto(DOMAIN);
  await page.waitForSelector('a[href="/api/logout"]');
}

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

test('when signed in, shows logout button', async () => {
  await authenticate();

  const text = await page.$eval('a[href="/api/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
})