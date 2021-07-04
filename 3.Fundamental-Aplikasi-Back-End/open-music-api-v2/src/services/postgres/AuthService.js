const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const QueryError = require('../../exceptions/QueryError');

class AuthService {

    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(token) {
        const tags = ['AuthService', 'addRefreshToken'];
        const result = await this._pool.query({
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }
    }

    async verifyRefreshToken(token) {
        const tags = ['AuthService', 'verifyRefreshToken'];
        const result = await this._pool.query({
            text: 'SELECT token from authentications WHERE token = $1',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Refresh token tidak valid', tags });
        }
    }

    async deleteRefreshToken(token) {
        await this.verifyRefreshToken(token);

        const tags = ['AuthService', 'deleteRefreshToken'];
        const result = await this._pool.query({
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }
    }

}

module.exports = AuthService;