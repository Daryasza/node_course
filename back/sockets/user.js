const util = require('../controllers/util.js');
const socketContrtoller = require('../controllers/socket.js');

exports.connect = async (socket, data) => {
  // Check message fields
  const status = util.checkBody(data, [
    'userId',
    'username'
  ])
  if (Object.keys(status).length)
    socket.emit('error', status.message)

  const socketRecord = await socketContrtoller.create({
    userId: data.userId,
    username: data.username,
    socketId: socket.id
  });
  if (!socketRecord) socket.emit('error');

  // Send a list of sockets to a new user
  const socketList = await socketContrtoller.list();
  if (!socketList) socket.emit('error');

  socket.emit('users:list', socketList)

  // Send a new user to all the sockets
  socket.broadcast.emit('users:add', socketRecord);
}

exports.disconnect = async (socket) => {
  socket.broadcast.emit('users:leave', socket.id)
  try {
    await socketContrtoller.delete(socket.id)
  } catch(err) { console.error(err); }
}
