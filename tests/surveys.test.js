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

  test('can see the form', async () => {
    const formLabelText = await page.getContentsOf('form label');
  
    expect(formLabelText).toEqual('Title');
  })

  describe('And using invalid form inputs', () => {
    beforeEach(async () => {
      await page.click('button[type="submit"]');
    });

    test('submitting shows error messages', async () => {
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
  
})