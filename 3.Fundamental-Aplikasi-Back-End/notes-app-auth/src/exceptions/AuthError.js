const ClientError = require('./ClientError');

class AuthError extends ClientError {

    constructor({ message = "Authentication Exception", error = null, tags = [] }) {
        super(message, 401);
        this.name = "Authentication Exception";
        this._error = error;
        this._tags = tags;

        this.saveLog();
    }

    // In case you will save error log into database
    saveLog() {
        console.log(`Message: ${this.name} - ${this.message}`);
        console.log(`Error: ${this._error ? this._error.message : ''}`);
        console.log(`Tags: ${this._tags}`);
    }

}

module.exports = AuthError;