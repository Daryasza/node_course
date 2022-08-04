const util = require('../controllers/util.js');
const messageContrtoller = require('../controllers/message.js');
const socketContrtoller = require('../controllers/socket.js');

exports.add = async (io, socket, data) => {
  // Check message fields
  const status = util.checkBody(data, [
    'senderId',
    'recipientId',
    'text'
  ])
  if (Object.keys(status).length)
    socket.emit('error', status.message)

  const realUserId = await socketContrtoller.getUserIdBySocketId(socket.id)
  if (!realUserId) socket.emit('error');

  const messageRecord = await messageContrtoller.create({
    senderId: realUserId,
    recipientId: data.recipientId,
    text: data.text
  });
  if (!messageRecord) socket.emit('error');

  // Send a new messageRecord to recipient and sender
  const recipientSocketId = await socketContrtoller.getSocketIdByUserId(
    data.recipientId
  )
  if (!recipientSocketId) socket.emit('error');

  try {
    io.to(socket.id).emit('message:add', messageRecord);
    io.to(recipientSocketId).emit('message:add', messageRecord);
  } catch(err) {
    console.error(err);
    socket.emit('error')
  }
}

exports.history = async (socket, data) => {
  // Check message fields
  const status = util.checkBody(data, [
    'userId',
    'recipientId'
  ])
  if (Object.keys(status).length)
    socket.emit('error', status.message)

  const realUserId = await socketContrtoller.getUserIdBySocketId(socket.id)
  if (!realUserId) socket.emit('error');

  const messageList = await messageContrtoller.list({
    senderId: realUserId,
    recipientId: data.recipientId
  });
  if (!messageList) socket.emit('error');

  try {
    socket.emit('message:history', messageList);
  } catch(err) {
    console.error(err);
    socket.emit('error')
  }
}
