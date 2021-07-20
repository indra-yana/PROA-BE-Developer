const { nanoid } = require('nanoid');
const { mapSongsDBToModel, mapSongsDBToModel2 } = require('../../utils');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const QueryError = require('../../exceptions/QueryError');

class PlaylistsSongsService {

    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
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

        await this._cacheService.delete(`playlist:${playlistId}`);

        return result.rows[0].id;
    }

    async getSongsOnPlaylist(playlistId) {
        try {
            // Mendapatkan data dari cache
            let result = await this._cacheService.get(`playlist:${playlistId}`);

            result = JSON.parse(result);
            result.isFromCache = true;

            return result;
        } catch (error) {
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

            const mappedResult = result.rows.map(mapSongsDBToModel2);

            // Menyimpan data playlist pada cache
            await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(mappedResult));

            return mappedResult;
        }
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const tags = ['PlaylistsSongsService', 'deleteSongFromPlaylist'];
        const result = await this._pool.query({
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id, playlist_id',
            values: [playlistId, songId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags });
        }

        if (!result.rowCount) {
            throw new InvariantError({ message: 'Lagu gagal dihapus dari playlist', tags });
        }

        const { playlist_id } = result.rows[0];
        await this._cacheService.delete(`playlist:${playlist_id}`);
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