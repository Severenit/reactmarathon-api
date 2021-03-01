import { Server } from 'socket.io';
import { GameService } from './game-service';
import { GameView } from './game-view';

export default (app) => {
    const gameService = new GameService();
    const gameView = new GameView();
    const disconnectedUsers = new Map();

    const io = new Server(app, {
        path: '/game-mode',
        cors: {
            origin: 'http://localhost:3000',
            headers: [
                'Accept',
                'Authorization',
                'Content-Type',
                'If-None-Match',
            ],
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'],
            credentials: true,
        },
    });
    console.log('Socketio initialised!');

    const gameMode = io.of('/game-mode');
    gameMode.on('connection', async (socket) => {
        const userId = socket.handshake.query.username;

        const checkRoomId = gameService.checkActiveUser(userId);
        if (checkRoomId) {
            disconnectedUsers.delete(userId);
            await socket.join(checkRoomId);
            socket
                .to(checkRoomId)
                .emit('on-game', gameService.getGameState(checkRoomId));
        }

        console.log(userId + ' connected');

        // socket.emit('get-rooms', gameView.roomsView);

        // client create room and wait for another client
        socket.once('create-room', async (data) => {
            if (validateData(data) === true) {
                const roomId = gameService.createRoom(userId, data);
                console.log(roomId);
                gameView.createView(roomId, userId, 'wait');
                console.log(gameView.roomsView);
                await socket.join(roomId);
                const view = gameView.roomsView;
                socket.emit('get-rooms', view);
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        // client join room with another client
        socket.once('join-room', async (data) => {
            if (validateData(data) === true) {
                console.log('#### User Data: ');
                console.log(data);
                const { roomId, pokemons } = data;
                gameService.joinRoom(userId, pokemons, roomId);
                gameView.updateView(roomId, userId, 'play');
                await socket.join(roomId);
                // socket.emit('get-rooms', gameView.roomsView);
                const game = gameService.getGameState(roomId);
                socket.to(roomId).emit('on-game', game);
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        // client create and join room with AI
        socket.once('join-ai', async (data) => {
            if (validateData(data) === true) {
                const roomId = gameService.joinAI(userId, data);
                const roomsView = gameView.createView(roomId, userId, 'ai');
                await socket.join(roomId);
                // socket.emit('get-rooms', roomsView);
                const game = gameService.getGameState(roomId);
                socket.to(roomId).emit('on-game', game);
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        socket.on('player-turn', async (data) => {
            if (validateData(data) === true) {
                const roomId = gameService.playerTurn(data, userId);
                socket
                    .to(roomId)
                    .emit('on-game', gameService.getGameState(roomId));
            }
        });

        socket.on('finish-game', async (data) => {
            const response = gameService.finishGame(data.roomId);
            socket.to(data.roomId).emit('finish', response);
            await socket.leave(data.roomId);
        });

        // client has not left the room
        // socket.on('disconnecting', async (reason) => {
        //     console.log(reason);
        //     const roomId = gameService.activeUsers.get(userId);
        //     socket
        //         .to(roomId)
        //         .emit(
        //             'connection-closed',
        //             `User with id: ${userId} disconnected from room with id: ${roomId}`,
        //         );
        //     await socket.leave(roomId);
        // });

        // client has left room
        socket.on('disconnecting', async (reason) => {
            console.log(reason);
            const roomId = gameService.activeUsers.get(userId);
            disconnectedUsers.set(userId, socket.id);
            await socket.leave(roomId);
            // crazy users can make event loop overusage
            setTimeout(() => {
                if (disconnectedUsers.has(userId)) {
                    gameService.disconnectUser(userId);
                    gameView.deleteView(roomId);
                }
            }, 30000);
        });
    });
};

const validateData = (data) => {
    if (
        data
        // (typeof data === Array && data.length === 5) ||
        // (typeof data === Object &&
        //     data.hasOwnProperty('pokemons') &&
        //     data.hasOwnProperty('roomId') &&
        //     typeof data.pokemons === Array &&
        //     data.pokemons.length === 5)
    ) {
        return true;
    } else {
        return false;
    }
};
