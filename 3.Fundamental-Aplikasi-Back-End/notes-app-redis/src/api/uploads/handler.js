const { responseSuccess, responseError } = require('../../utils');

class UploadsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        try {
            const { data } = request.payload;
            this._validator.validateImageHeaders(data.hapi.headers);

            const filename = await this._service.writeFile(data, data.hapi);

            return responseSuccess(h, 'File berhasil diupload', { 
                fileLocation: `http://${process.env.APP_HOST}:${process.env.APP_PORT}/upload/images/${filename}`,
            }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

}

module.exports = UploadsHandler;