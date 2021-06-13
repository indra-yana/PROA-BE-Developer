const Hapi = require('@hapi/hapi');
const notesPlugin = require('./api/notes');
const NotesService = require('./services/inMemory/NotesServices');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const notesService = new NotesService();
    await server.register([
        {
            plugin: notesPlugin,
            options: {
                service: notesService,
            }
        },
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();
