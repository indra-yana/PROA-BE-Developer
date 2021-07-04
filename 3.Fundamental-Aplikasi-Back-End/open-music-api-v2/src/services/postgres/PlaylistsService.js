const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistsDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const QueryError = require('../../exceptions/QueryError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {

    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const tags = ['PlaylistsService', 'addPlaylist'];
        const id = `playlist-${nanoid(16)}`;

        const result = await this._pool.query({
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rows[0].id) {
            throw new InvariantError({ message: 'Playlist gagal ditambahkan', tags });
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const tags = ['PlaylistsService', 'getPlaylists'];
        const result = await this._pool.query({
            text: `SELECT playlists.*, users.username FROM playlists
                   LEFT JOIN users ON users.id = playlists.owner
                   WHERE playlists.owner = $1 OR users.id = $1`,
            values: [owner],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        return result.rows.map(mapPlaylistsDBToModel);
    }

    async getPlaylistById(id) {
        const tags = ['PlaylistsService', 'getPlaylistById'];
        const result = await this._pool.query({
            text: `SELECT playlists.*, users.username FROM playlists
                   LEFT JOIN users ON users.id = playlists.owner
                   WHERE playlists.id = $1`,
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Playlist tidak ditemukan', tags });
        }

        return result.rows.map(mapPlaylistsDBToModel)[0];
    }

    async editPlaylistById(id, { name }) {
        const tags = ['PlaylistsService', 'editPlaylistById'];
        const updatedAt = new Date().toISOString();
        const result = await this._pool.query({
            text: `UPDATE playlists SET name = $1
                   WHERE id = $2 RETURNING id`,
            values: [name, id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Gagal memperbarui playlist. Id tidak ditemukan', tags });
        }
    }

    async deletePlaylistById(id) {
        const tags = ['PlaylistsService', 'deletePlaylistById'];
        const result = await this._pool.query({
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Playlist gagal dihapus, Id tidak ditemukan', tags });
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const tags = ['PlaylistsService', 'verifyPlaylistOwner'];
        const result = await this._pool.query({
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'Playlist tidak ditemukan', tags });
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError({ message: 'Anda tidak berhak mengakses resource ini', tags });
        }
    }

    // TODO: @verifyPlaylistAccess
    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof QueryError) {
                throw error;
            }

            try {
                // await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

}

module.exports = PlaylistsService;