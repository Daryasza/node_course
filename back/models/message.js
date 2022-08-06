var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    text: { type: String, required: true },
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('Message', MessageSchema, 'messages');
