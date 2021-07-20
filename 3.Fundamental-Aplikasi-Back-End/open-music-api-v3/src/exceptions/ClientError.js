class ClientError extends Error {

    constructor(message = 'Bad Request', statusCode = 400) {
        super(message);
        this.name = 'Client Exception';
        this.statusCode = statusCode;
    }

}

module.exports = ClientError;