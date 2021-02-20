import fs from "fs";
import path from "path";
import http from "http";
import Hapi from "@hapi/hapi";
import { BOARD_MIN } from "./constants";
import { socket } from "./game-socket/index";

const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

const init = async () => {

  const server = Hapi.server({
    port,
  });
  console.dir({ server });

  await server.register(require("@hapi/inert"));

  // server.route.options.cors({
  //     origin: '*',
  //     headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
  //     credentials: true,
  // })

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello My Dear Friend!";
    },
  });

  server.route({
    method: "GET",
    path: "/api/pokemons/board",
    handler: (request, h) => {
      return BOARD_MIN;
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);

  const ioServer = http.Server(server);
  socket(ioServer);

  ioServer.listen(port + 1, () => {
    console.log(`Game socket listening on port ${port + 1}`);
  });
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);

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
          return 'Hello My Dear Friend!!!'
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
  
    const ioServer = http.Server(server);
    socket(ioServer);

    ioServer.listen(port + 1, () => {
      console.log(`Game socket listening on port ${port + 1}`);
    });
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);

});

init();
