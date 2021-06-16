require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notesPlugin = require('./api/notes');
const NotesService = require('./services/inMemory/NotesServices');
const NotesValidator = require('./validator/notes');

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
    await server.register([{
        plugin: notesPlugin,
        options: {
            service: notesService,
            validator: NotesValidator,
        }
    }, ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();