const ServerError = require("./ServerError");

class QueryError extends ServerError {

    constructor({ message = 'Terjadi kegagalan query', error = null, tags = [] }) {
        super(message);
        this.name = 'Query Exception';
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

module.exports = QueryError;