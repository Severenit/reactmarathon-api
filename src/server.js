import fs from 'fs';
import path from 'path';
import Hapi from '@hapi/hapi';

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const init = async () => {
    const server = Hapi.server({
        port,
    });

    await server.register(require('@hapi/inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
          return 'Hello World'
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
