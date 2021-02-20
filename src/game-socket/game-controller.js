import { Server } from "socket.io";

const randomId = () => {
  return Math.floor(Math.random() * 100);
};

export default (app) => {
  const rooms = new Map();

  const io = new Server(app, { path: "/game-mode" });
  console.log("Socketio initialised!");

  const gameMode = io.of("/game-mode");
  gameMode.on("connection", async (socket) => {
    const userId = socket.id;
    socket.emit("get-rooms", rooms);
    socket.on("create-room", async (data) => {
      const userPokemons = JSON.parse(data);
      const roomId = randomId();
      const room = new Room({
        io: gameMode,
        socket,
        userId,
        userPokemons,
        roomId,
      });
      rooms.set(room.roomId, room);
      await socket.join(roomId);
    });
    socket.on("join-room", async (data) => {
      const userId = socket.id;
      const { roomId, pokemons } = JSON.parse(data);
      const room = rooms.get(roomId);
      if (room.opponentId !== 0) {
        const errMessage = `Room with given id: ${roomId} is actually full`;
        console.log(errMessage);
        socket.emit("room-error", errMessage);
      } else {
        room.opponentPokemons(pokemons);
        room.opponentId(userId);
        rooms.delete(roomId);
        await socket.join(roomId);
        socket.to(roomId).emit("game-start", room);
      }
    });

    socket.on("join-ai", async (data) => {
      const userId = socket.id;
      const pokemons = JSON.parse(data);
      const roomId = randomId();
      const room = new Room({
        io: gameMode,
        socket,
        userId,
        pokemons,
        roomId,
      });
      // logic to take AI as opponent
      await socket.join(roomId);
      socket.to(roomId).emit("game-start", room);
    });
  });
};

class Room {
  constructor(params) {
    this.io = params.io; // namespace in our case '/game-mode'
    this.socket = params.socket;

    this.userId = params.userId;
    this.userPokemons = params.userPokemons;
    this.roomId = params.roomId;
    this.opponentId = 0;
    this.opponentPokemons = {};
    this.board = new Board();
  }

  get roomId() {
    return this.roomId;
  }

  set opponentPokemons(pokemons) {
    this.opponentPokemons = pokemons;
  }

  set opponentId(id) {
    this.opponentId = id;
  }
}

class Board {
  constructor() {
    this.board = "board";
  }
}
