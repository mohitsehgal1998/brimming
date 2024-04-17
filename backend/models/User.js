const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  phone_no: {
    type : Number,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);