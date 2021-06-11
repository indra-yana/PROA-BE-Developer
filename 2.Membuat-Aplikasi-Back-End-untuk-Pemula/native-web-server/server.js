const http = require('http');

class HttpServer {
    constructor(port = 8500, host = 'localhost') {
        this.port = port;
        this.host = host;
    }

    ignite = (requestListener) => {
        const server = http.createServer(requestListener);
        server.listen(this.port, this.host, () => {
            console.log(`Server berjalan pada http://${this.host}:${this.port}`);
        });
    }
}

module.exports = HttpServer;