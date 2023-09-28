const requireSendGrid = require('../middlewares/requireSendGrid');
const mongoose = require('mongoose');
const { Path } = require('path-parser');
const { URL } = require('url');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  app.post('/api/mailer/webhooks', requireSendGrid, async (req, res) => {
    const pattern = new Path('/api/surveys/:surveyId/:answer');
    
    const answers = req.body.reduce((accumulator, { event, email, url }) => {
      if (event === 'click') {
        const match = pattern.test(new URL(url).pathname);
        if (match) {
          const { surveyId, answer } = match;
          const newItem = { email, surveyId, answer };
          if (!accumulator.some(item => item.email === newItem.email && item.surveyId === newItem.surveyId)) {
            accumulator.push(newItem);
          }
        }
      }
      return accumulator;
    }, []);

    const bulkUpdateOperations = answers.map(({ email, surveyId, answer }) => ({
      filter: {
        _id: surveyId,
        recipients: {
          $elemMatch: {
            email: email,
            answer: null
          }
        },
      },
      update: {
          $set: {
            'recipients.$.answer': answer === 'yes'
          },
          $inc: { [answer]: 1 }
      },
    }));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {      
      for (const { filter, update } of bulkUpdateOperations) {
        await Survey.updateMany(filter, update, { session });
      }

      await session.commitTransaction();
      session.endSession();
      
      return res.send({});
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      
      return res.status(500).send('Internal Server Error: ' + error.message);
    }
  });
}