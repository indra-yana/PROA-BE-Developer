const { responseSuccess, responseError } = require('../../utils');

class PlaylistsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
        this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);

            const { name = 'Untitled' } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

            return responseSuccess(h, 'Playlist berhasil ditambahkan', { playlistId }, 201);
        } catch (error) {
            return responseError(h, error);
        }

    }

    async getPlaylistsHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._service.getPlaylists(credentialId);

            return responseSuccess(h, 'Playlist berhasil didapatkan', { playlists });   
        } catch (error) {
            return responseError(h, error);
        }
    }

    async getPlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistAccess(id, credentialId);
            
            const playlist = await this._service.getPlaylistById(id);

            return responseSuccess(h, 'Playlist berhasil didapatkan', { playlist });
        } catch (error) {
            return responseError(h, error);
        }

    }

    async putPlaylistByIdHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);

            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyPlaylistAccess(id, credentialId);
            await this._service.editPlaylistById(id, request.payload);

            return responseSuccess(h, 'Playlist berhasil diperbarui');
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            
            await this._service.verifyPlaylistOwner(id, credentialId);
            await this._service.deletePlaylistById(id);

            return responseSuccess(h, 'Playlist berhasil dihapus');
        } catch (error) {
            return responseError(h, error);
        }

    }

}

module.exports = PlaylistsHandler;