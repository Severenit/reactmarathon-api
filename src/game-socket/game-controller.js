import { Server } from 'socket.io';
import { GameService } from './game-service';
import { GameView } from './game-view';

export default (app) => {
    const gameService = new GameService();
    const gameView = new GameView();

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
            await socket.join(checkRoomId);
        }

        console.log(userId + ' connected');

        socket.emit('get-rooms', roomsView);

        // client create room and wait for another client
        socket.once('create-room', async (data) => {
            if (validateData(data) === true) {
                const roomId = gameService.createRoom(userId, data);
                const roomsView = gameView.createView(roomId, userId, 'wait');
                await socket.join(roomId);
                socket.emit('get-rooms', roomsView);
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        // client join room with another client
        socket.once('join-room', async (data) => {
            if (validateData(data) === true) {
                const { roomId, pokemons } = data;
                gameService.joinRoom(userId, pokemons, roomId);
                const roomsView = gameView.updateView(roomId, userId, 'play');
                await socket.join(roomId);
                socket.emit('get-rooms', roomsView);
                socket.to(roomId).emit('game-start', 'game room full');
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        // client create and join room with AI
        socket.once('join-ai', async (data) => {
            if (validateData(data) === true) {
                const roomId = gameService.joinAI(userId, data);
                const roomsView = gameView.createView(roomId, userId, 'ai');
                await socket.join(roomId);
                socket.emit('get-rooms', roomsView);
                socket.to(roomId).emit('game-start', 'game room full');
            } else socket.emit('error', 'Validation Error: Bad request');
        });

        // client has not left the room
        socket.on('disconnecting', async (reason) => {
            console.log(reason);
            const roomId = activeUsers.get(userId)[1];
            socket
                .to(roomId)
                .emit(
                    'connection-closed',
                    `User with id: ${userId} disconnected from room with id: ${roomId}`,
                );
            await socket.leave(roomId);
        });

        // client has left room
        socket.on('disconnect', (reason) => {
            console.log(reason);
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
