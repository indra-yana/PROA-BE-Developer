const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapNotesDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const QueryError = require('../../exceptions/QueryError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesService {

    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    async addNote({ title, body, tags, owner }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const logTags = ['NotesService', 'addNote'];

        const result = await this._pool.query({
            text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, body, tags, createdAt, updatedAt, owner],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: logTags });
        }

        if (!result.rows[0].id) {
            throw new InvariantError({ message: 'Catatan gagal ditambahkan', tags: logTags });
        }

        return result.rows[0].id;
    }

    async getNotes(owner) {
        const tags = ['NotesService', 'getNotes'];
        const result = await this._pool.query({
            // text: 'SELECT * FROM notes WHERE owner = $1',
            text: `SELECT notes.* FROM notes 
                   LEFT JOIN collaborations ON collaborations.note_id = notes.id 
                   WHERE notes.owner = $1 OR collaborations.user_id = $1 
                   GROUP BY notes.id`,
            values: [owner],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        return result.rows.map(mapNotesDBToModel);
    }

    async getNoteById(id) {
        const tags = ['NotesService', 'getNoteById'];
        const result = await this._pool.query({
            // text: 'SELECT * FROM notes WHERE id = $1',
            text: `SELECT notes.*, users.username FROM notes 
                   LEFT JOIN users ON users.id = notes.owner
                   WHERE notes.id = $1`,
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Catatan tidak ditemukan', tags });
        }

        return result.rows.map(mapNotesDBToModel)[0];
    }

    async editNoteById(id, { title, body, tags }) {
        const logTags = ['NotesService', 'editNoteById'];
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
            values: [title, body, tags, updatedAt, id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: logTags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Gagal memperbarui catatan. Id tidak ditemukan', tags: logTags });
        }
    }

    async deleteNoteById(id) {
        const tags = ['NotesService', 'deleteNoteById'];
        const result = await this._pool.query({
            text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Catatan gagal dihapus, Id tidak ditemukan', tags });
        }
    }

    async verifyNoteOwner(id, owner) {
        const tags = ['NotesService', 'verifyNoteOwner'];
        const result = await this._pool.query({
            text: 'SELECT * FROM notes WHERE id = $1',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Catatan tidak ditemukan', tags });
        }

        const note = result.rows[0];

        if (note.owner !== owner) {
            throw new AuthorizationError({ message: 'Anda tidak berhak mengakses resource ini', tags });
        }
    }

    async verifyNoteAccess(noteId, userId) {
        try {
            await this.verifyNoteOwner(noteId, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof QueryError) {
                throw error;
            }

            try {
                await this._collaborationService.verifyCollaborator(noteId, userId);
            } catch {
                throw error;
            }
        }
    }

}

module.exports = NotesService;