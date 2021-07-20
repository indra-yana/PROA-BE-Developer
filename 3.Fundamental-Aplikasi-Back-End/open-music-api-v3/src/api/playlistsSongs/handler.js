const { responseSuccess, responseError } = require('../../utils');

class PlaylistsSongsHandler {

    constructor(playlistsSongsService, playlistsService, validator) {
        this._playlistsSongsService = playlistsSongsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
        this.getSongsOnPlaylistHandler = this.getSongsOnPlaylistHandler.bind(this);
        this.deleteSongOnPlaylistByIdHandler = this.deleteSongOnPlaylistByIdHandler.bind(this);
    }

    async postSongToPlaylistHandler(request, h) {
        try {
            this._validator.validatePostSongToPlaylistPayload(request.payload);

            const { playlistId } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const playlistSongId = await this._playlistsSongsService.addSongToPlaylist(playlistId, songId);

            return responseSuccess(h, 'Lagu berhasil ditambahkan ke playlist', { playlistSongId }, 201);
        } catch (error) {
            return responseError(h, error);
        }

    }

    async getSongsOnPlaylistHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { playlistId } = request.params;

            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            const songs = await this._playlistsSongsService.getSongsOnPlaylist(playlistId);
            const { isFromCache = false } = songs;

            return responseSuccess(h, 'Playlist berhasil didapatkan', { songs, isFromCache });   
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deleteSongOnPlaylistByIdHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { playlistId } = request.params;
            const { songId } = request.payload;
            
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistsSongsService.deleteSongFromPlaylist(playlistId, songId);

            return responseSuccess(h, 'Lagu berhasil dihapus dari playlist');
        } catch (error) {
            return responseError(h, error);
        }

    }

}

module.exports = PlaylistsSongsHandler;