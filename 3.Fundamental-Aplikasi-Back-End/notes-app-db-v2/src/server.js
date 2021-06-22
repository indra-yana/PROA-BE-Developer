const dotenv = require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Notes Plugin
const notesPlugin = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

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

    const notesService = new NotesService();
    const usersService = new UsersService();
    await server.register([
        {
            plugin: notesPlugin,
            options: {
                service: notesService,
                validator: NotesValidator,
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