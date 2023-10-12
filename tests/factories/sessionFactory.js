const Keygrip = require('keygrip');
const safeBuffer = require('safe-buffer');
const keys = require('../../config/keys');

const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const passportObject = { passport: { user: user._id.toString() } };
  
  const session = safeBuffer.Buffer.from(JSON.stringify(passportObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);
  
  return { session, sig };
}