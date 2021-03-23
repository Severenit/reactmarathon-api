/*
  rooms logic handler
  rooms = {
    [roomId]: {
      userId,
      username,
    }
  }
*/
const { v4: uuidv4 } = require('uuid');

class RoomService {
  constructor() {
    this.rooms = {};
  }

  addRoom(userId, username, roomname) {
    const roomId = uuidv4();
    this.rooms[roomId] = {
      userId: userId,
      username: username,
      roomname: roomname,
    };
    return roomId;
  }

  deleteRoom(roomId) {
    delete this.rooms[roomId];
  }
}

module.exports = RoomService;
