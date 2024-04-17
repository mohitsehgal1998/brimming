const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: Number,
    ref: 'User'
  }
});

module.exports = mongoose.model('Message', messageSchema);
