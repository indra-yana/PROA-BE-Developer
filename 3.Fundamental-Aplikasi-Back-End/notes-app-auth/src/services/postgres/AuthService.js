const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');
const QueryError = require('../../exceptions/QueryError');

class AuthService {

    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(token) {
        const result = await this._pool.query({
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['AuthService', 'addRefreshToken'] });
        }
    }

    async verifyRefreshToken(token) {
        const result = await this._pool.query({
            text: 'SELECT token from authentications WHERE token = $1',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['AuthService', 'verifyRefreshToken'] });
        }

        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    async deleteRefreshToken(token) {
        await this.verifyRefreshToken(token);

        const result = await this._pool.query({
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['AuthService', 'deleteRefreshToken'] });
        }
    }

}

module.exports = AuthService;