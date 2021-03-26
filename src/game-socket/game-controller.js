import WebSocket from 'ws';
import { Game } from './game-service';
import { RoomService } from './rooms-service';
import { PubSubManager } from '../pubsub/pubsub';
import { v4 } from 'uuid';
import {
  everyMessageValidation,
  createRoomValidation,
  joinRoomValidation,
  playerTurnValidation,
} from '../validation.js';

export default (app) => {
  const roomService = new RoomService();
  const sockets = new Map();
  const games = new Map();
  const pubSubManager = new PubSubManager();

  pubSubManager.createChannel('/rooms');

  const wss = new WebSocket.Server({ server: app });

  wss.on('connection', (ws, request, client) => {
    ws.id = v4();
    console.log('Websocket connected');
    pubSubManager.subscribe(ws, '/rooms');

    ws.on('message', (message) => {
      const parseMessage = (msg) => {
        try {
          return JSON.parse(msg);
        } catch (err) {
          console.log(err);
          ws.send(JSON.stringify(err));
          ws.terminate();
        }
      };

      const payload = parseMessage(message);

      pubSubManager.publish(ws, '/rooms', JSON.stringify(roomService.rooms));

      if (everyMessageValidation(payload) === true) {
        const { type, data } = payload;

        if ((type === 'createRoom') & (createRoomValidation(data) === true)) {
          const { userId, username, roomname, pokemons } = data;
          const roomId = roomService.addRoom(userId, username, roomname);
          sockets.set(ws.id, { userId: userId, roomId: roomId });

          const game = new Game();
          game.createPlayer1(userId, pokemons);
          games.set(roomId, game);

          console.log(roomService.rooms);
          pubSubManager.publish(
            ws,
            '/rooms',
            JSON.stringify(roomService.rooms)
          );
          pubSubManager.unsubscribe(ws, '/rooms');

          pubSubManager.createChannel(`/play/${roomId}`);
          pubSubManager.subscribe(ws, `/play/${roomId}`);
          pubSubManager.publish(
            ws,
            `/play/${roomId}`,
            JSON.stringify(game.getGameState(roomId))
          );
        } else if (
          (type === 'joinRoom') &
          (joinRoomValidation(data) === true)
        ) {
          const { userId, roomId, pokemons } = data;

          const game = games.get(roomId);
          game.createPlayer2(userId, pokemons);
          games.set(roomId, game);

          roomService.deleteRoom(roomId);
          pubSubManager.subscribe(ws, `/play/${roomId}`);
          pubSubManager.publish(
            ws,
            `/play/${roomId}`,
            JSON.stringify(game.getGameState(roomId))
          );
        } else if (
          (type === 'playerTurn') &
          (playerTurnValidation(data) === true)
        ) {
          const { roomId, userId, position, card } = data;

          const game = games.get(roomId);
          const isFinish = game.onPlayerTurn(userId, position, card);

          games.set(roomId, game);

          if (isFinish === true) {
            pubSubManager.publish(
              ws,
              `/play/${roomId}`,
              JSON.stringify(game.onFinishGame())
            );
            ws.terminate();
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
          }

          pubSubManager.publish(
            ws,
            `/play/${roomId}`,
            JSON.stringify(game.getGameState(roomId))
          );
        } else {
          const err = new Error('Invalid message');
          console.log(err);
          ws.send(JSON.stringify(err));
        }
      } else {
        const err = new Error('Invalid message type');
        console.log(err);
        ws.send(JSON.stringify(err));
      }
    });

    ws.on('close', () => {
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
    });
  });

  // app.on('upgrade', (req, socket, head) => {
  // 	// authenticate(req, (err, client) => {
  // 			// if (err || !client) {
  // 			//   socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  // 			//   socket.destroy();
  // 			//   return;
  // 			// }

  // 			wss.handleUpgrade(req, socket, head, function done(ws) {
  // 				wss.emit('connection', ws, req, client);
  // 			});
  // 		});
};
