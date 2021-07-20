const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapSongsDBToModel, mapSongsDBToModel2 } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const QueryError = require('../../exceptions/QueryError');

class SongsService {

    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, performer, genre, duration }) {
        const tags = ['SongsService', 'addSong'];
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const result = await this._pool.query({
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rows[0].id) {
            throw new InvariantError({ message: 'Lagu gagal ditambahkan', tags });
        }

        return result.rows[0].id;
    }

    async getSongs() {
        const tags = ['SongsService', 'getSongs'];
        const result = await this._pool.query({
            text: 'SELECT id, title, performer FROM songs'
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        return result.rows.map(mapSongsDBToModel2);
    }

    async getSongById(id) {
        const tags = ['SongsService', 'getSongById'];
        const result = await this._pool.query({
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Lagu tidak ditemukan', tags });
        }

        return result.rows.map(mapSongsDBToModel)[0];
    }

    async editSongById(id, { title, year, performer, genre, duration }) {
        const tags = ['SongsService', 'editSongById'];
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Gagal memperbarui lagu. Id tidak ditemukan', tags });
        }
    }

    async deleteSongById(id) {
        const tags = ['SongsService', 'deleteSongById'];
        const result = await this._pool.query({
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Lagu gagal dihapus, Id tidak ditemukan', tags });
        }
    }

}

module.exports = SongsService;