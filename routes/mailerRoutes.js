const requireSendGrid = require('../middlewares/requireSendGrid');
const mongoose = require('mongoose');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  app.post('/api/mailer/webhooks', requireSendGrid, async (req, res) => {
    console.log('Webhook executed', req.body);

    const answers = [];
    
    req.body.forEach(({ event, email, url }) => {
      switch (event) {
        case 'click':
          const regexPattern = /\/api\/surveys\/([^/]+)\/([^/]+)$/;
          const match = url.match(regexPattern);
          if (match) {
            const surveyId = match[1];
            const answer = match[2];
            answers.push({ email, surveyId, answer });
          } else {
            console.log('URL does not match the expected pattern');
          }
        default:
          // Nothing
      }
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bulkUpdateOperations = answers.map(({ email, surveyId, answer }) => ({
        filter: { _id: surveyId, 'recipients.email': email, },
        update: { $set: {'recipients.$.answer': answer === 'yes'}, },
      }));
      
      for (const { filter, update } of bulkUpdateOperations) {
        await Survey.updateMany(filter, update, { session });
      }

      await session.commitTransaction();
      session.endSession();
      
      console.log('Bulk update completed.');

      return res.send({});
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      
      console.error('Error during bulk update:', error);
      
      return res.status(500).send('Internal Server Error: ' + error.message);
    }
  });
}