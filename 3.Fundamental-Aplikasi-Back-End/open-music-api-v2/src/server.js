const dotenv = require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Songs Plugin
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Users Plugin
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

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

    // Init Service Instance
    const songsService = new SongsService();
    const usersService = new UsersService();

    // registrasi plugin internal
    await server.register([
        {
            plugin: songsPlugin,
            options: {
                service: songsService,
                validator: SongsValidator,
            }
        },
        {
            plugin: usersPlugin,
            options: {
                service: usersService,
                validator: UsersValidator,
            }
        },
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();