const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

const DOMAIN = 'http://localhost:3001';

module.exports = class AuthenticablePage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    });
    
    const page = await browser.newPage();
    const authenticablePage = new AuthenticablePage(page);

    return new Proxy(authenticablePage, {
      get: function(target, property, receiver) {
        // Below commented code should work for previous puppeteer versions
        // return target[property] || browser[property] || page[property];
        
        if (target[property]) {
          return target[property];
        }
        
        let value;
        
        value = browser[property];

        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? browser : this, args);
          };
        }

        value = page[property];

        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? page : this, args);
          };
        }

        return value;
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const session = sessionFactory(user._id);
    
    await this.page.setCookie({ name: 'session', value: session.session });
    await this.page.setCookie({ name: 'session.sig', value: session.sig });
    await this.page.goto(DOMAIN);
    await this.page.waitForSelector('a[href="/api/logout"]');
  }

  async getContentsOf(selector) {
    return await this.page.$eval(selector, el => el.innerHTML);
  }
}