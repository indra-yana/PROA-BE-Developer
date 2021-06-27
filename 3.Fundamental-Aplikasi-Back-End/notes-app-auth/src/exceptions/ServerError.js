class ServerError extends Error {

    constructor(message = "Internal Server Error", statusCode = 500) {
        super(message);
        this.name = 'Server Exception';
        this.statusCode = statusCode;
    }

}

module.exports = ServerError;