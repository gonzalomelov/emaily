const mongoose = require('mongoose');

const keys = require('../config/keys');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

function isEmail(inputString) {
  // Define a regular expression pattern to match an email string
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
  // Test if the input string matches the pattern
  return pattern.test(inputString);
}

module.exports = app => {
  app.get('/api/surveys/:_/:_(yes|no)', (req, res) => {
    res.send('Thanks!');
  });

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, recipients, from = keys.mailerFrom, subject, body } = req.body;

    if (!title) {
      return res.status(400).send({
        error: 'You must add a `title` to the Survey.'
      });
    }

    if (!recipients) {
      return res.status(400).send({
        error: 'You must add a `recipients` to the Survey.'
      });
    }

    const recipientsArray = recipients.split(',').map(email => ({ email: email.trim() }));

    if (recipientsArray.some(({ email }) => !isEmail(email))) {
      return res.status(400).send({
        error: '`recipients` must only have recipients.'
      });
    }

    if (!from) {
      return res.status(400).send({
        error: 'You must add a `from` to the Survey.'
      });
    }

    if (!subject) {
      return res.status(400).send({
        error: 'You must add a `subject` to the Survey.'
      });
    }

    if (!body) {
      return res.status(400).send({
        error: 'You must add a `body` to the Survey.'
      });
    }
    
    const survey = new Survey({
      title,
      recipients: recipientsArray,
      from,
      subject,
      body,
      _user: req.user.id
    });

    req.user.credits -= 1;
    
    const mailer = new Mailer(survey.recipients, survey.from, survey.subject, surveyTemplate(survey));

    // // Start Transaction
    // async function performTransaction() {
    //   const session = await mongoose.startSession();

    //   try {
    //     session.startTransaction();

    //     await mailer.send();

    //     await survey.save({ session });
    //     const user = await req.user.save({ session });

    //     await session.commitTransaction();

    //     return user;
    //   } catch (error) {
    //     await session.abortTransaction();
    //     throw error;
    //   } finally {
    //     session.endSession();
    //   }
    // }

    // performTransaction().then(user => {
    //   return res.send(user);
    // }).catch(error => {
    //   return res.status(500).send({ error: 'Email could not be sent. Try again later!' });
    // });
    // // End Transaction

    // Start Without Transaction
    try {
      await mailer.send();

      await survey.save();
      const user = await req.user.save();

      return res.send(user);
    } catch (error) {
      // // Rollback DB changes
      // await survey.deleteOne();
      // req.user.credits += 1;
      // await req.user.save();

      return res.status(500).send({ error: 'Email could not be sent. Try again later!' });
    }
    // Finish Without Transaction
  })
}
