var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SocketSchema = new Schema(
  {
    socketId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    activeRoom: { type: String, default: null }
  }
);

module.exports = mongoose.model('Socket', SocketSchema, 'sockets');
