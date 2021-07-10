const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const QueryError = require('../../exceptions/QueryError');

class CollaborationsService {

    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(noteId, userId) {
        const id = `collab-${nanoid(16)}`;
        const tags = ['CollaborationsService', 'addCollaboration'];

        const result = await this._pool.query({
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, noteId, userId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Kolaborasi gagal ditambahkan', tags });
        }

        return result.rows[0].id;
    }

    async deleteCollaboration(noteId, userId) {
        const tags = ['CollaborationsService', 'deleteCollaboration'];
        const result = await this._pool.query({
            text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
            values: [noteId, userId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Kolaborasi gagal dihapus', tags });
        }
    }

    async verifyCollaborator(noteId, userId) {
        const tags = ['CollaborationsService', 'verifyCollaborator'];
        
        const result = await this._pool.query({
            text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
            values: [noteId, userId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Kolaborasi gagal diverifikasi', tags });
        }
    }
}

module.exports = CollaborationsService;