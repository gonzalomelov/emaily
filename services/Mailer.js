const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor(recipients, from, subject, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridApiKey);
    this.recipients = recipients.map(({ email }) => new helper.Email(email));
    this.from_email = new helper.Email(from);
    this.subject = subject;
    this.content = new helper.Content('text/html', content);

    this.addContent(this.content);
    this.addClickTracking();
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
    this.addRecipients();
  }

  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    })
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    })
    
    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;