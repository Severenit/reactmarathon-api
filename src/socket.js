const uWS = require('uWebSockets.js');
const {
  everyMessageValidation,
  createRoomValidation,
  joinRoomValidation,
  playerTurnValidation,
} = require('./validation.js');
const { v4: uuidv4 } = require('uuid');
const Game = require('./game-socket/domains/game-entity');
const RoomService = require('./game-socket/rooms-service');
const port = process.env.PORT || 4001;

const sockets = new Map();
const games = new Map();

const roomService = new RoomService();

const server = uWS.App();

server
  .ws('/api/game-socket', {
    /* Options */
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 30,
    maxBackpressure: 1024,

    /* Todo, Setting 1: merge messages in one, or keep them as separate WebSocket frames - mergePublishedMessages */
    /* Todo, Setting 4: send to all including us, or not? That's not a setting really just use ws.publish or global uWS.publish */

    /* Handlers */
    open: (ws) => {
      ws.id = uuidv4();

      /* Let this client listen to all sensor topics */
      console.log('WebSocket connected');
      ws.subscribe('/rooms');
    },
    message: (ws, message) => {
      /* Parse this message according to some application
       * protocol such as JSON [action, topic, message] */
      const parseMessage = (msg) => {
        try {
          return JSON.parse(Buffer.from(msg));
        } catch (error) {
          ws.send(error.toString());
          ws.close();
        }
      };

      const payload = parseMessage(message);
      console.log(payload);

      ws.publish('/rooms', JSON.stringify(roomService.rooms));

      if (lvl1Validation(payload) === true) {
        const { type, data } = payload;

        if ((type === 'createRoom') & (createRoomValidation(data) === true)) {
          const { userId, username, roomname, pokemons } = data;
          const roomId = roomService.addRoom(userId, username, roomname);
          sockets.set(ws.id, { userId: userId, roomId: roomId });

          const game = new Game();
          game.createPlayer1(userId, pokemons);
          games.set(roomId, game);

          console.log(roomService.rooms);
          ws.publish('/rooms', JSON.stringify(roomService.rooms));
          ws.unsubscribe('/rooms');

          ws.subscribe(`/play/${roomId}`);
          ws.publish(`/play/${roomId}`, JSON.stringify(game));
        } else if (
          (type === 'joinRoom') &
          (joinRoomValidation(data) === true)
        ) {
          const { userId, roomId, pokemons } = data;

          const game = games.get(roomId);
          game.createPlayer2(userId, pokemons);
          games.set(roomId, game);

          roomService.deleteRoom(roomId);
          ws.subscribe(`/play/${roomId}`);
          ws.publish(`/play/${roomId}`, JSON.stringify(game));
        } else if (
          (type === 'playerTurn') &
          (playerTurnValidation(data) === true)
        ) {
          const { roomId, move, p1, p2, playerNames } = data;

          const game = games.get(roomId);
          game.onPlayerTurn(move, p1, p2, playerNames);
          games.set(roomId, game);

          ws.publish(`/play/${roomId}`, JSON.stringify(game));
        } else {
          const err = new Error('Invalid request type');
          console.log(err);
          ws.send(err.toString());
        }
      } else {
        const err = new Error('Invalid request type');
        console.log(err);
        ws.send(err.toString());
      }
    },
    drain: (ws) => {

		},
    close: (ws, code, message) => {
      /* The library guarantees proper unsubscription at close */
      if (sockets.has(ws.id)) {
        const userIds = sockets.get(ws.id);
        roomService.deleteRoom(userIds.roomId);
        if (games.has(userIds.roomId)) {
          games.delete(userIds.roomId);
        }
      }
			console.log(roomService.rooms);
			console.log(games);
      console.log('Socket closed');
    },
  })
  .listen(port, (token) => {
    if (token) {
      console.log('Listening to port ' + port);
    } else {
      console.log('Failed to listen to port ' + port);
    }
  });
