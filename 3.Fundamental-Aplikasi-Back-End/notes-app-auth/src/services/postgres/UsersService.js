const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthError = require('../../exceptions/AuthError');
const QueryError = require('../../exceptions/QueryError');

class UsersService {

    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        
        const tags = ['UsersService', 'addUser'];
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await this._pool.query({
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'User gagal ditambahkan', tags });
        }

        return result.rows[0].id;
    }

    async getUserById(userId) {
        const tags = ['UsersService', 'getUserById'];
        const result = await this._pool.query({
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'User tidak ditemukan', tags });
        }

        return result.rows[0];
    }

    async verifyNewUsername(username) {
        const tags = ['UsersService', 'verifyNewUsername'];
        const result = await this._pool.query({
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (result.rowCount > 0) {
            throw new InvariantError({ message: 'Gagal menambahkan user. Username sudah digunakan', tags });
        }
    }

    async verifyUserCredential(username, password) {
        const tags = ['UsersService', 'verifyUserCredential'];
        const result = await this._pool.query({
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new AuthError('Kredensial yang Anda berikan salah');
        }

        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthError('Kredensial yang Anda berikan salah');
        }

        return id;
    }

}

module.exports = UsersService;