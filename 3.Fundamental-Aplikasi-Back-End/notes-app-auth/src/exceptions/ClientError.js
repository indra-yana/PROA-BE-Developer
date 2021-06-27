class ClientError extends Error {

    constructor(message = "Bad Request", statusCode = 400) {
        super(message);
        this.name = 'ClientError';
        this.statusCode = statusCode;
    }

}

module.exports = ClientError;