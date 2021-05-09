const http = require('http');

const requestListener = (request, response) => {
    response.setHeader('Content-Type', 'text/html');

    response.statusCode = 200;
    response.end('<p>Hallo HTTP server!</p>');
}

const server = http.createServer(requestListener);
const port = 8500;
const host = 'localhost';

server.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
});