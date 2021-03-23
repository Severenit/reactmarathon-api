const fastify = require('fastify')({ logger: true });
const STARTER = require('./constants/startPack.json');
const { BOARD_MIN } = require('./constants/constants');
const createPlayer = require('./createPlayer/createPlayer');
const TripleTriadPlayer = require('./solver/tripleTriadPlayerNew');

const activeUsers = new Map();

fastify.register(require('fastify-cors'), {
    origin: true,
    allowedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'If-None-Match',
        'X-Requested-With',
    ],
    credentials: true,
});

fastify.route({
    method: 'GET',
    path: '/api/pokemons/board',
    handler: (request, reply) => {
        reply.send({
            data: BOARD_MIN,
        });
    },
});

fastify.route({
    method: 'GET',
    path: '/api/pokemons/starter',
    handler: (request, reply) => {
        reply.send({
            data: STARTER,
        });
    },
});

fastify.route({
    method: 'POST',
    path: '/api/pokemons/player-game',
    handler: (request, reply) => {
        const { p1, p2, board, playerNames, move } = request.payload;

        const params = {
            ai: false,
            currentPlayer: playerNames,
            hands: { p1, p2 },
            move,
            board,
        };

        const player = new TripleTriadPlayer();
        const turn = player.play(params);

        console.log('####: turn', turn);

        reply.send(turn);
    },
});

fastify.route({
    method: 'GET',
    path: '/api/pokemons/create',
    handler: (request, reply) => {
        const result = createPlayer();
        reply.send({
            data: result,
        });
    },
});

fastify.route({
    method: 'POST',
    path: '/api/pokemons/game',
    handler: (request, reply) => {
        const {
            p1,
            p2,
            board: initialBoard,
            playerNames,
            move,
        } = request.payload;
        const board = initialBoard.filter((item) => item !== 0).length > 0;

        const params = {
            ai: true,
            currentPlayer: playerNames,
            hands: { p1, p2 },
            move,
            // move: {hits: [1,2,3,4], position: 4},
            board: board && initialBoard,
        };

        const player = new TripleTriadPlayer();
        const turn = player.play(params);

        reply.send(turn);
    },
});

fastify.route({
    method: 'GET',
    url: '/api/find',
    handler: (req, reply) => {
        // this will handle http requests
        const userId = req.payload.localId;
        activeUsers.set(userId, null);
        reply.send({ hello: 'world' });
    },

});

fastify.route({
    method: 'GET',
    url: '/api/play',
    handler: (req, reply) => {
        // this will handle http requests
        const username = req.payload.username;
        reply.send({ hello: 'world' });
    },
    wsHandler: (conn, req) => {
        // this will handle websockets connections
        conn.setEncoding('utf8');
        conn.write('hello client');

        conn.once('data', (chunk) => {
            conn.end();
        });
    },
});

fastify.route({
    method: 'GET',
    url: '/api/finish',
    handler: (req, reply) => {
        // this will handle http requests
        const username = req.payload.username;
        reply.send({ hello: 'world' });
    },
});

fastify.route({
    method: 'GET',
    url: '/socket',
    websocket: true,
    handler: (connection, req) => {
        const ipCli = req.socket.remoteAddress;

        // console.log(connection);
        connection.socket.on('message', (message) => {
            connection.socket.send(message);
        });
    },
});

fastify.route({
    method: 'GET',
    url: '/hello',
    schema: {
        // request needs to have a querystring with a `name` parameter
        querystring: {
            name: { type: 'string' },
        },
        // the response needs to be an object with an `hello` property of type 'string'
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' },
                },
            },
        },
    },
    // this function is executed for every request before the handler is executed
    preHandler: (request, reply, done) => {
        // E.g. check authentication
        done();
    },
    handler: (request, reply) => {
        reply.send({ hello: 'world' });
    },
});

fastify.listen(4000, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
