const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapNotesDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const QueryError = require('../../exceptions/QueryError');

class NotesService {

    constructor() {
        this._pool = new Pool();
    }

    async addNote({ title, body, tags }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const result = await this._pool.query({
            text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, title, body, tags, createdAt, updatedAt],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['NotesService', 'addNote'] });
        }

        if (!result.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getNotes() {
        const result = await this._pool.query('SELECT * FROM notes').catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['NotesService', 'getNotes'] });
        }

        return result.rows.map(mapNotesDBToModel);
    }

    async getNoteById(id) {
        const result = await this._pool.query({
            text: 'SELECT * FROM notes WHERE id = $1',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['NotesService', 'getNoteById'] });
        }

        if (!result.rowCount) {
            throw new NotFoundError('Catatan tidak ditemukan');
        }

        return result.rows.map(mapNotesDBToModel)[0];
    }

    async editNoteById(id, { title, body, tags }) {
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [title, body, tags, updatedAt, id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['NotesService', 'editNoteById'] });
        }

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
        }
    }

    async deleteNoteById(id) {
        const result = await this._pool.query({
            text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['NotesService', 'deleteNoteById'] });
        }

        if (!result.rowCount) {
            throw new NotFoundError('Catatan gagal dihapus, Id tidak ditemukan');
        }
    }

}

module.exports = NotesService;