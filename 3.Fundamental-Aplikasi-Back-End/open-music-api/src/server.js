const dotenv = require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const init = async() => {
    const server = Hapi.server({
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const songsService = new SongsService();
    await server.register([{
        plugin: songsPlugin,
        options: {
            service: songsService,
            validator: SongsValidator,
        }
    }, ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();