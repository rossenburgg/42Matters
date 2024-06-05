const { Server } = require("socket.io");
const Notification = require('../models/Notification');

let io;

const initSocketIO = (server) => {
  io = new Server(server);
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const emitNotificationToUser = async (userId, notification) => {
  try {
    const socketio = getIO();
    const unreadNotifications = await Notification.find({ userId: userId, read: false }).count();
    socketio.to(userId).emit('notification count', unreadNotifications);
    socketio.to(userId).emit('new notification', notification);
    console.log(`Notification emitted to user ${userId}`);
  } catch (error) {
    console.error("Error emitting notification to user:", userId, error);
    console.error(error.stack);
  }
};

module.exports = { initSocketIO, getIO, emitNotificationToUser };