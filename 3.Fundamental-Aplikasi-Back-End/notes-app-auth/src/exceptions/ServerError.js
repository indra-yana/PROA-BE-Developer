class ServerError extends Error {

    constructor(message = "Internal Server Error", statusCode = 500) {
        super(message);
        this.name = 'ServerError';
        this.statusCode = statusCode;
    }

}

module.exports = ServerError;