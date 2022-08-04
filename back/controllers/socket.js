const util = require('./util.js');
const Socket = require('../models/socket.js');

const requiredFields = [
  'socketId',
  'userId',
  'username',
  'activeRoom'
]

exports.getUserIdBySocketId = async (socketId) => {
  try {
    const socket = await Socket.findOne({ socketId });
    if (!socket) return;
    return socket.userId;
  } catch(err) {
    console.error(err);
    return;
  }
};

exports.getSocketIdByUserId = async (userId) => {
  try {
    const socket = await Socket.findOne({ userId });
    if (!socket) return;
    return socket.socketId;
  } catch(err) {
    console.error(err);
    return;
  }
};

exports.list = async () => {
  try {
    const sockets = await Socket.find();
    return util.cutResponse(sockets, requiredFields);
  } catch(err) {
    console.error(err);
    return;
  }
}

exports.create = async (data) => {
  try {
    var socket = new Socket(data);
    socket = await socket.save();
    return util.cutResponse([socket], requiredFields)[0];
  } catch(err) {
    console.error(err);
    return;
  }
};

exports.delete = async (socketId) => {
  try {
    await Socket.findOneAndDelete({ socketId });
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
};
