const ServerError = require("./ServerError");

class QueryError extends ServerError {
    
    constructor(message = 'Terjadi kegagalan query') {
        super(message);
        this.name = 'QueryError';
    }

}

module.exports = QueryError;