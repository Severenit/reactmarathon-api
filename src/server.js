import fs from 'fs';
import path from 'path';
import http from 'http';
import Hapi from '@hapi/hapi';
import { BOARD_MIN } from './constants';
import { socket } from './game-socket/index';
import { playerTurn } from './playerTurn';
import { createPlayer } from './createPlayer';

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

console.log(port);
console.log(host);

const init = async () => {
    const server = Hapi.server({
        port,
        routes: {
            cors: {
                origin: ['*'],
                headers: [
                    'Accept',
                    'Authorization',
                    'Content-Type',
                    'If-None-Match',
                ],
                credentials: true,
                additionalHeaders: ['X-Requested-With'],
            },
        },
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return 'Hello My Dear Friend!';
        },
    });

    server.route({
        method: 'GET',
        path: '/api/pokemons/board',
        handler: () => {
            return {
                data: BOARD_MIN,
            };
        },
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/players-turn',
        handler: (request) => {
            const result = playerTurn(request.payload);
            return {
                data: result,
            };
        },
    });

    server.route({
        method: 'GET',
        path: '/api/pokemons/create',
        handler: () => {
            const result = createPlayer();
            return {
                data: result,
            };
        },
    });

    const ioServer = server.listener;
    socket(ioServer);

    await server.start();
    console.log('Server running on %s', server.info.uri);
    // ioServer.listen(port, () => {
    //     console.log(`Game socket listening on port ${port}`);
    // });
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
