const http = require('http');

const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    response.statusCode = 200;

    const { method } = request;

    if (method === 'GET') {
        response.end(`Response = ${method}`);
    }

    if (method === 'POST') {
        response.end(`Response = ${method}`);
    }

    if (method === 'DELETE') {
        response.end(`Response = ${method}`);
    }

    if (method === 'PUT') {
        response.end(`Response = ${method}`);
    }
}

const server = http.createServer(requestListener);
const port = 8500;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});