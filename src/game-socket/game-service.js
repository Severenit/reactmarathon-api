const Game = require('./domains/game-entity.js');
const createPlayer = require('../createPlayer/createPlayer');

class GameService {
  constructor() {
    this.rooms = {};
    this.activeUsers = new Map();
  }

  checkActiveUser(userId) {
    if (this.activeUsers.has(userId)) {
      return this.activeUsers.get(userId);
    } else return;
  }

  createGame(userId, data) {
    const game = new Game();
    game.createPlayer1(userId, data);
    console.log('#### createRoom: ');
    console.log(game);
    const roomId = game.roomId;
    this.rooms[roomId] = game;
    this.activeUsers.set(userId, roomId);
    return roomId;
  }

  joinRoom(userId, data, roomId) {
    if (roomId === null || roomId === undefined || roomId === '') {
      console.log('roomId should be a string');
      return;
    }
    const game = this.rooms[roomId];
    console.log('#### GetExistingRoom: ');
    console.log(game);
    console.log(roomId);
    if (game.p2.userId === '') {
      game.createPlayer2(userId, data);
      game.firstTurnOwner();
      this.activeUsers.set(userId, roomId);
      console.log('#### joinRoom: ');
      console.log(game);
      return game.roomId;
    } else return console.log('Room is actually full, try find another game');
  }

  joinAI(userId, data) {
    const game = new Game();
    game.createPlayer1(userId, data);
    const opponentId = 'AI';
    const opponentPokemons = createPlayer();
    game.createPlayer2(opponentId, opponentPokemons).firstTurnOwner();
    this.rooms.set(game.roomId, game);
    this.activeUsers.set(userId, game.roomId);
    return game.roomId;
  }

  playerTurn(payload, userId) {
    const roomId = this.activeUsers.get(userId);
    const game = this.rooms.get(roomId);
    game.onPlayerTurn(payload);
    this.rooms.set(roomId, game);
    return roomId;
  }

  getGameState(roomId) {
    const game = this.rooms.get(roomId);
    return game;
  }

  finishGame(roomId) {
    const game = this.rooms.get(roomId);
    const response = game.onFinishGame();
    this.rooms.delete(roomId);
    return response;
  }

  disconnectUser(userId) {
    const roomId = this.activeUsers.get(userId);
    this.rooms.delete(roomId);
    this.activeUsers.delete(userId);
  }
}

module.exports = GameService;
