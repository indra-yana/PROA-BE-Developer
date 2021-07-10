const { responseSuccess, responseError } = require('../../utils');

class ExportsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
    }

    async postExportNotesHandler(request, h) {
        try {
            this._validator.validateExportNotesPayload(request.payload);

            const message = {
                userId: request.auth.credentials.id,
                targetEmail: request.payload.targetEmail,
            }

            await this._service.sendMessage('export:notes', JSON.stringify(message));

            return responseSuccess(h, 'Permintaan Anda dalam antrean', { }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

}

module.exports = ExportsHandler;