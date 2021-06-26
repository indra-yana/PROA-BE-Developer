const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {

    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await this._pool.query({
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        });

        if (!result.rowCount) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getUserById(userId) {
        const result = await this._pool.query({
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        });

        if (!result.rowCount) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyNewUsername(username) {
        const result = await this._pool.query({
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        });

        if (result.rowCount > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
        }
    }

}

module.exports = UsersService;