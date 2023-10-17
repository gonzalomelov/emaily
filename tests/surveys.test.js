const AutheticablePage = require('./helpers/AuthenticablePage');

const DOMAIN = 'http://localhost:3001';

let page;

beforeEach(async () => {
  page = await AutheticablePage.build();
  await page.goto(DOMAIN);
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
  beforeEach(async () => {
    
  });

  test.only('Cannot create survey', async () => {
    const res = await page.post('/api/surveys', {
      subject: 'subject',
      title: 'title',
      body: 'body',
      recipients: 'a@email.com'
    });

    expect(res).toEqual({"error": "You must log in!"});  
  })

  test.only('Cannot fetch surveys', async () => {
    const res = await page.get('/api/surveys');

    expect(res).toEqual({"error": "You must log in!"});  
  })
})