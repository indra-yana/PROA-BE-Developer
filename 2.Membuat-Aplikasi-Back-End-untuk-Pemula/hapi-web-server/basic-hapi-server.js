const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 8500,
        host: 'localhost',
    });
    
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, handler) => {
                return 'Home page!';
            }
        },
        {
            method: 'GET',
            path: '/about',
            handler: (request, handler) => {
                return 'About page!';
            }
        }
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();