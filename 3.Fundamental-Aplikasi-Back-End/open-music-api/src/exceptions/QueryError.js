const ServerError = require("./ServerError");

class QueryError extends ServerError {

    constructor({ message = 'Terjadi kegagalan query', error = null }) {
        super(message);
        this.name = 'QueryError';
        this._error = error;

        this.saveLog();
    }

    // In case you will save error log into database
    saveLog() {
        console.log(this.message);
        console.log(this._error.message);
    }

}

module.exports = QueryError;