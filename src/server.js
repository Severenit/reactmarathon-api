import Hapi from '@hapi/hapi';
import {BOARD_MIN, STARTER} from './constants';
import {playerTurn} from './playerTurn';
import {createPlayer} from './createPlayer';
import {normalizeData} from './solver/normalize';
import TripleTriadPlayer from "./solver/TripleTriadPlayer";

const port = process.env.PORT || 4000;

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
        method: 'GET',
        path: '/api/pokemons/starter',
        handler: () => {
            return {
                data: STARTER,
            };
        },
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/player-game',
        handler: (request) => {
            const {p1, p2, board, playerNames, move} = request.payload;
            console.log('####: request.payload', request.payload);

            const params = {
                ai: false,
                currentPlayer: playerNames,
                hands: {p1, p2},
                move,
                board,
            };

            const player = new TripleTriadPlayer();
            const turn = player.play(params);

            console.log('####: turn', turn);

            return turn;
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

    server.route({
        method: 'POST',
        path: '/api/pokemons/game',
        handler: (request) => {
            const {p1, p2, board, playerNames, move} = request.payload;

            const params = {
                ai: true,
                currentPlayer: playerNames,
                hands: {p1, p2},
                move,
                // move: {hits: [1,2,3,4], position: 4},
                board,
            };

            const player = new TripleTriadPlayer();
            const turn = player.play(params);
            console.log('####: turn', turn);
            return turn;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
