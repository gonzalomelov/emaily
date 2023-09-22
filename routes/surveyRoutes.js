const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

function isCommaSeparated(inputString) {
  // Define a regular expression pattern to match a comma-separated string
  const pattern = /^[^,]+(,[^,]+)*$/;
  
  // Test if the input string matches the pattern
  return pattern.test(inputString);
}

module.exports = app => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, to, from, subject, body } = req.body;

    if (!title) {
      return res.status(400).send({
        error: 'You must add a `title` to the Survey.'
      });
    }

    if (!to) {
      return res.status(400).send({
        error: 'You must add a `to` to the Survey.'
      });
    }

    if (!isCommaSeparated(to)) {
      return res.status(400).send({
        error: '`to` must be a comma-separated string with emails.'
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
      to: to.split(',').map(email => ({ email: email.trim() })),
      from,
      subject,
      body,
      _user: req.user.id
    });

    req.user.credits -= 1;
    
    const mailer = new Mailer(survey.to, survey.from, survey.subject, surveyTemplate(survey));

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
