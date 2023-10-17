const AuthenticablePage = require('./helpers/AuthenticablePage');
const keys = require('../config/keys');

let page;

beforeEach(async () => {
  page = await AuthenticablePage.build();

  await page.goto(keys.web);
})

afterEach(async () => {
  await page.close();
})

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  
  expect(text).toEqual('Emaily');
})

test('clicking login starts OAuth flow', async () => {
  await page.click('.right a');
  
  const url = await page.url();
  
  expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, shows logout button', async () => {
  await page.login();

  const text = await page.getContentsOf('a[href="/api/logout"]');

  expect(text).toEqual('Logout');
})