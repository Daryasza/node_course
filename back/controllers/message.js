const util = require('./util.js');
const Message = require('../models/message.js');

const requiredFields = [
  'senderId',
  'recipientId',
  'text'
]

exports.create = async (data) => {
  try {
    var message = new Message(data);
    message = await message.save();
    return util.cutResponse([message], requiredFields)[0];
  } catch(err) {
    console.error(err);
    return;
  }
};

exports.list = async (data) => {
  try {
    var messages = await Message.find().or([
      {
        senderId: data.senderId,
        recipientId: data.recipientId
      },
      {
        senderId: data.recipientId,
        recipientId: data.senderId
      }
    ]);
    return util.cutResponse(messages, requiredFields);
  } catch(err) {
    console.error(err);
    return;
  }
}
