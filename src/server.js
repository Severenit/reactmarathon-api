import Hapi from '@hapi/hapi';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import { BOARD_MIN, MK_PLAYER } from './constants';
import {createPlayer} from './createPlayer';
import TripleTriadPlayer from "./solver/TripleTriadPlayer";
import path from 'path';
import Handlebars from 'handlebars';
import { enemyAttack, playerAttack } from './mk/fight';
import {registerTemplate} from './template/registerEmail';
import {existEmail} from './template/existEmail';

import {google} from 'googleapis';

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/firebase.database"
];

import startPack from './constants/startPack.json';
import allPokemons from './constants/pokemonsUpdate.json';
import { checkError, getBearer, handleError } from './utils';
import { welcomeEmail } from './template/welcomeEmail';


const port = process.env.PORT || 4000;
const host = process.env.NODE_ENV === 'development' ? 'localhost' : null;
const IMG = /\.(jpg|jpeg|gif|png)(\?v=\d+\.\d+\.\d+)?$/;

function getRandom(num = 0) {
    return Math.floor(Math.random() * num)
}

const init = async () => {
    const server = Hapi.server({
        port,
        host,
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
            return 'Hello';
        },
    });

    // Assets
    server.route({
        method: 'GET',
        path: '/assets/{path*}',
        handler: (request, h) => {
            if (IMG.test(request.path)) {
                return h.file(path.join(process.cwd(), 'dist', request.path));
            }
        }
    });

    // Pokemons
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
                data: startPack,
            };
        },
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/player-game',
        handler: (request) => {
            const {p1, p2, board, playerNames, move} = request.payload;

            const params = {
                ai: false,
                currentPlayer: playerNames,
                hands: {p1, p2},
                move,
                board,
            };

            const player = new TripleTriadPlayer();
            const turn = player.play(params);

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
        path: '/api/pokemons/game/start',
        handler: (request) => {
            const { pokemons } = JSON.parse(request.payload);

            const game = new TripleTriadPlayer();
            const generatePoke = game.generateAiHand(pokemons, allPokemons);

            return {
                data: generatePoke
            };
        },
    });

    server.route({
        method: 'POST',
        path: '/api/pokemons/game',
        handler: (request) => {
            const {hands: { p1, p2 }, board: initBoard, currentPlayer, move: initMove} = JSON.parse(request.payload);
            const player = new TripleTriadPlayer();

            const player1 = player.pokesToHandCfg(p1);
            const player2 = player.pokesToHandCfg(p2);

            const move = player1.find(item => {
                if (initMove !== null && item.poke.id === initMove?.poke?.id) {
                    return true;
                }

                return false;
            });

            function prepareBoard(board) {
                return board.map(item => {
                    if (item.card === null) {
                        return 0;
                    }
                });
            }

            function sum(args) {
                let res = true;
                for (let i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'object') {
                        res = false;
                        break;
                    }
                }

                return res;
            }

            function returnBoard(board) {
                return board.map((item, index) => {
                    let card = null;
                    if (typeof item === 'object') {
                        card = {
                            ...item.poke,
                        }
                    }

                    return {
                        position: index + 1,
                        card,
                    }
                });
            }

            let params = {};

            if (initMove === null) {
                params = {
                    ai: true,
                    currentPlayer,
                    hands: {
                        p1: player1,
                        p2: player2,
                    },
                    board: sum(initBoard) ? null : initBoard,
                }
            } else {
                params = {
                    ai: false,
                    currentPlayer,
                    hands: {
                        p1: player1,
                        p2: player2,
                    },
                    move: {
                        ...move,
                        position: initMove.position - 1,
                    },
                    board: sum(initBoard) ? null : initBoard,
                }
            }

            const turnPlayer = player.play(params);

            if (initMove === null) {
                return turnPlayer;
            }

            const {board, hands} = turnPlayer;

            const paramsAi = {
                ai: true,
                currentPlayer: 'p2',
                hands,
                board,
            };

            const turnAi = player.play(paramsAi);

            return {
                ...turnAi,
                board: turnAi.board,
                oldBoard: board,
            };
        }
    });

    // Mortal Kombat
    server.route({
        method: 'GET',
        path: '/api/mk/players',
        handler: () => {
            return MK_PLAYER;
        }
    });

    server.route({
        method: 'GET',
        path: '/api/mk/player/choose',
        handler: () => {
            const player = MK_PLAYER[getRandom(MK_PLAYER.length)];
            return player;
        }
    });

    server.route({
        method: 'POST',
        path: '/api/mk/player/fight',
        handler: (request) => {
            const {hit, defence} = JSON.parse(request.payload);

            return {
                player1: playerAttack({hit, defence}),
                player2: enemyAttack(),
            };
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
