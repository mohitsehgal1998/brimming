const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  agent_id: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Agent', agentSchema);
