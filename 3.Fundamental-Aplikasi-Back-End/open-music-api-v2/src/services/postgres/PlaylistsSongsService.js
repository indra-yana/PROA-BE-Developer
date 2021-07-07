const { nanoid } = require('nanoid');
const { mapSongsDBToModel, mapSongsDBToModel2 } = require('../../utils');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const QueryError = require('../../exceptions/QueryError');

class PlaylistsSongsService {

    constructor() {
        this._pool = new Pool();
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `playlistsong-${nanoid(16)}`;
        const tags = ['PlaylistsSongsService', 'addSongToPlaylist'];

        const result = await this._pool.query({
            text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Lagu gagal ditambahkan ke playlist', tags });
        }

        return result.rows[0].id;
    }

    async getSongsOnPlaylist(playlistId) {
        const tags = ['SongsService', 'getSongs'];
        const result = await this._pool.query({
            text: `SELECT songs.id, songs.title, songs.performer FROM songs
                   LEFT JOIN playlists_songs ON playlists_songs.song_id = songs.id
                   LEFT JOIN collaborations ON collaborations.playlist_id = playlists_songs.playlist_id
                   WHERE playlists_songs.playlist_id = $1 OR collaborations.playlist_id = $1
                   GROUP BY songs.id`,
            values: [playlistId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        return result.rows.map(mapSongsDBToModel2);
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const tags = ['PlaylistsSongsService', 'deleteSongFromPlaylist'];
        const result = await this._pool.query({
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Lagu gagal dihapus dari playlist', tags });
        }
    }

    async verifyCollaborator(noteId, userId) {
        const tags = ['PlaylistsSongsService', 'verifyCollaborator'];
        
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

module.exports = PlaylistsSongsService;