const AutheticablePage = require('./helpers/AuthenticablePage');
const keys = require('../config/keys');

let page;

beforeEach(async () => {
  page = await AutheticablePage.build();
  
  await page.goto(keys.web);
})

afterEach(async () => {
  await page.close();
})

describe('When signed in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a[href="/surveys/new"]');
  });

  test('Can see the form', async () => {
    const formLabelText = await page.getContentsOf('form label');
  
    expect(formLabelText).toEqual('Title');
  })

  describe('And using valid form inputs', () => {
    beforeEach(async () => {
      await page.type('input[name="subject"]', 'subject');
      await page.type('input[name="title"]', 'title');
      await page.type('input[name="body"]', 'body');
      await page.type('input[name="recipients"]', 'a@email.com');

      await page.click('button[type="submit"]');
    });

    test('Submitting takes user to a review screen', async () => {
      const formReviewTitle = await page.getContentsOf('h2');
    
      expect(formReviewTitle).toEqual('Please confirm your entries');
    })

    test('Submitting then saving adds survey to "Survey Index" page', async () => {
      await page.click('button.teal.right');

      await page.waitForSelector('div.card');
      const cardTitle = await page.getContentsOf('span.card-title');

      expect(cardTitle).toEqual('title');
    })
  });

  describe('And using invalid form inputs', () => {
    beforeEach(async () => {
      await page.click('button[type="submit"]');
    });

    test('Submitting shows error messages', async () => {
      const subjectErrorText = await page.getContentsOf('.subject .red-text');
      const titleErrorText = await page.getContentsOf('.title .red-text');
      const bodyErrorText = await page.getContentsOf('.body .red-text');
      const recipientsErrorText = await page.getContentsOf('.recipients .red-text');
    
      expect(subjectErrorText).toEqual('You must provide a ' + 'subject');
      expect(titleErrorText).toEqual('You must provide a ' + 'title');
      expect(bodyErrorText).toEqual('You must provide a ' + 'body');
      expect(recipientsErrorText).toEqual('You must provide a ' + 'recipients');
    })
  });
});

describe('When not signed in', () => {
  const actions = [
    {
      method: 'post',
      path: '/api/surveys',
      data: {
        subject: 'subject',
        title: 'title',
        body: 'body',
        recipients: 'a@email.com'
      }
    },
    {
      method: 'get',
      path: '/api/surveys'
    },
  ];

  test('Cannot access private routes', async () => {
    const results = await page.execRequests(actions);
    expect(results).toEqual(Array(actions.length).fill({"error": "You must log in!"}));
  })
})