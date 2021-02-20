import openSocket from "socket.io-client";
const gameUrl = "http://localhost:4001/game-mode";

const socket = openSocket(`${gameUrl}`, { path: "/game-mode" });

export class SocketAPI {
  constructor() {
    this.socket = socket;
  }

  getRoomsSocket(cb) {
    this.socket.on("get-rooms", (data) => {
      cb(JSON.parse(data));
    });
  }

  createRoom(pokemons) {
    this.socket.emit("create-room", pokemons);
  }

  joinRoom(roomId, pokemons) {
    this.socket.emit("join-room", { roomId: roomId, pokemons });
    socket.on("room-error", (errMessage) => {
      console.log(errMessage);
    });
  }

  playWithAI(pokemons) {
    this.socket.emit("join-ai", pokemons);
  }

  handleGameStart(cb) {
    this.socket.on("game-start", (data) => {
      cb(JSON.parse(data));
    });
  }
}
