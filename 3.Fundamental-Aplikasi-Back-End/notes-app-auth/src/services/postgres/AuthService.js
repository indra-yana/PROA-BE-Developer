const { Pool } = require("pg");
const InvariantError = require('../../exceptions/InvariantError');

class AuthService {

    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(token) {
        await this._pool.query({
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        });
    }

    async verifyRefreshToken(token) {
        const result = await this._pool.query({
            text: 'SELECT token from authentications WHERE token = $1',
            values: [token],
        });

        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    async deleteRefreshToken(token) {
        await this.verifyRefreshToken(token);

        await this._pool.query({
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        });
    }

}

module.exports = AuthService;