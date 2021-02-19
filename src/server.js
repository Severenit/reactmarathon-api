import fs from 'fs';
import path from 'path';
import Hapi from '@hapi/hapi';
import {BOARD_MIN} from './constants';

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const init = async () => {
    const server = Hapi.server({
        port,
    });

    await server.register(require('@hapi/inert'));

    // server.route.options.cors({
    //     origin: '*',
    //     headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
    //     credentials: true,
    // })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
          return 'Hello My Dear Friend!'
        }
    });

    server.route({
        method: 'GET',
        path: '/api/pokemons/board',
        handler: (request, h) => {
          return BOARD_MIN;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
