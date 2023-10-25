const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  recipients: [RecipientSchema],
  from: String,
  subject: String,
  body: String,
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  yes: {
    type: Number,
    default: 0
  },
  no: {
    type: Number,
    default: 0
  },
  imageUrl: String,
});

mongoose.model('surveys', surveySchema);