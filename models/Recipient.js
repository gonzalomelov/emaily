const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
  email: String,
  answer: {
    type: Boolean,
    default: null
  }
});

module.exports = recipientSchema;