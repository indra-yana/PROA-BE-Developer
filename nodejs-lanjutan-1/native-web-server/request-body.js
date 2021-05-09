const HttpServer = require('./server');

const requestListener = (request, response) => {
    let body = [];

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        body = Buffer.concat(body).toString();
        const { name } = JSON.parse(body);

        response.end(`<h1>Hai, ${name}!</h1>`);
    });
}

const server = new HttpServer();
server.ignite(requestListener);