const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongsDBToModel, mapSongsDBToModel2 } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {

    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const result = await this._pool.query({
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
        });

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs LIMIT 1');

        return result.rows.map(mapSongsDBToModel2);
    }

    async getSongById(id) {
        const result = await this._pool.query({
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        });

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows.map(mapSongsDBToModel)[0];
    }

    async editSongById(id, { title, year, performer, genre, duration }) {
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        });

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const result = await this._pool.query({
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        });

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus, Id tidak ditemukan');
        }
    }

}

module.exports = SongsService;