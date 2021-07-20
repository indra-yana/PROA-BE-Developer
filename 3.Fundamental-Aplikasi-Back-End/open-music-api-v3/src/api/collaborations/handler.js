const { responseSuccess, responseError } = require('../../utils');

class CollaborationsHandler {

    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService; 
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

            return responseSuccess(h, 'Kolaborasi berhasil ditambahkan', { collaborationId }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaboration(playlistId, userId);

            return responseSuccess(h, 'Kolaborasi berhasil dihapus');
        } catch (error) {
            return responseError(h, error);
        }
    }
}

module.exports = CollaborationsHandler;