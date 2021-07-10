const { responseSuccess, responseError } = require('../../utils');

class CollaborationsHandler {

    constructor(collaborationsService, notesService, validator) {
        this._collaborationsService = collaborationsService; 
        this._notesService = notesService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { noteId, userId } = request.payload;

            await this._notesService.verifyNoteOwner(noteId, credentialId);
            const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);

            return responseSuccess(h, 'Kolaborasi berhasil ditambahkan', { collaborationId: collaborationId }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { noteId, userId } = request.payload;

            await this._notesService.verifyNoteOwner(noteId, credentialId);
            await this._collaborationsService.deleteCollaboration(noteId, userId);

            return responseSuccess(h, 'Kolaborasi berhasil dihapus');
        } catch (error) {
            return responseError(h, error);
        }
    }
}

module.exports = CollaborationsHandler;