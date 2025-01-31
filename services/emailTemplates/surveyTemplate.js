const keys = require('../../config/keys');

module.exports = survey => `
  <p>Dear recipient,</p>
  <p>We would appreciate your feedback on our service.</p>
  <p>${survey.body}</p>
  <p>Please click on the following links to provide your feedback:</p>
  <ul>
    <li><a href="${keys.api}/api/surveys/${survey.id}/yes">Yes</a></li>
    <li><a href="${keys.api}/api/surveys/${survey.id}/no">No</a></li>
  </ul>
  <p>Thank you for your valuable input.</p>
`;