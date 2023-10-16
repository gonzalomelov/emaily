const mongoose = require('mongoose');

const User = mongoose.model('users');

const createUserWithCredits = () => {
  return new User({ credits: 10 }).save();
}

const createUserWithoutCredits = () => {
  return new User({}).save();
}

module.exports = {
  createUserWithCredits,
  createUserWithoutCredits
}