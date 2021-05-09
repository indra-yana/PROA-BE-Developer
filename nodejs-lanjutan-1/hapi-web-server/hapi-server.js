const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 8500,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();

/*
curl -X GET http://localhost:5000
// output: Homepage
curl -X GET http://localhost:5000/about
// output: About page
curl -X GET http://localhost:5000/test
// output: Halaman tidak ditemukan
curl -X POST http://localhost:5000
// output: Halaman tidak dapat diakses dengan method tersebut

// Path parameter
curl -X GET http://localhost:5000/hello/dicoding
// output: Hello, dicoding!
curl -X GET http://localhost:5000/hello
// output: Hello, stranger!

// Path and Query parameter
curl -X GET http://localhost:5000/hello/dicoding?lang=id
// output: Hai, dicoding!
curl -X GET http://localhost:5000/hello/dicoding
// output: Hello, dicoding!

// Request Body
curl -X POST -H "Content-Type: application/json" http://localhost:8500/login -d "{\"username\": \"Dicoding\", \"password\": \"AyoBelajar\"}" -i
*/