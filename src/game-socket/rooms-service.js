/*
  rooms logic handler
  rooms = {
    [roomId]: {
      userId,
      username,
    }
  }
*/
import { v4 } from 'uuid';

export class RoomService {
  constructor() {
    this.rooms = {};
  }

  addRoom(userId, username, roomname) {
    const roomId = v4();
		// const roomId = '228';
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
