import fs from 'fs';
import path from 'path';
import http from 'http';
import Hapi from '@hapi/hapi';
import {BOARD_MIN} from './constants';
import {socket} from './game-socket/index';
import {playerTurn} from './playerTurn';
import {createPlayer} from './createPlayer';
import {normalizeData} from './solver/normalize';
import TripleTriadPlayer from "./solver/TripleTriadPlayer";

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';

const init = async () => {

    const server = Hapi.server({
        port,
    });
    console.dir({server});

    await server.register(require('@hapi/inert'));

    // server.route.options.cors({
    //     origin: '*',
    //     headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
    //     credentials: true,
    // })

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
            return BOARD_MIN;
        }
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/players-turn',
        handler: (request) => {
            const result = playerTurn(request.payload);
            return {
                data: result
            };
        }
    });

    server.route({
        method: 'GET',
        path: '/api/pokemons/create',
        handler: () => {
            const result = createPlayer();
            return {
                data: result
            };
        }
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/game',
        handler: (request) => {
            const { playerNames, move } = request.payload;
            const [p1, p2, board] = normalizeData(request.payload);
            console.log('####: move', move);
            const player = new TripleTriadPlayer();
            const turn = player.play({
                ai: true,
                currentPlayer: playerNames,
                hands: {p1, p2},
                // move: {hits: [1,2,3,4], position: 4},
                board,
            });
            console.log('####: turn', turn);
            //
            // console.log('####: handPlayer1', handPlayer1);
            // console.log('####: handPlayer2', handPlayer2);
            // const solver = new TripleTriadSolver();
            // const {rate, game} = solver.solve(
            //     [
            //         [0, 0, 0],
            //         [0, 0, 0],
            //         [0, 0, 0],
            //     ],
            //     [[1, 2, 3, 4], [5, 2, 3, 4], [6, 2, 3, 4], [7, 2, 3, 4], [8, 2, 3, 4]],
            //     [[4, 4, 4, 4], [5, 6, 6, 6], [6, 8, 9, 9], [7, 7, 7, 7], [1, 1, 1, 1]],
            //     5
            // );

            return 'Hello';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

    const ioServer = http.Server(server);
    socket(ioServer);

    ioServer.listen(port + 1, () => {
        console.log(`Game socket listening on port ${port + 1}`);
    });
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
