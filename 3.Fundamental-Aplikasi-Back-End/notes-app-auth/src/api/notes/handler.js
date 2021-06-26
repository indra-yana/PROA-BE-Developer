const { responseSuccess, responseError } = require('../../utils');

class NotesHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    async postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { title = 'Untitled', body, tags } = request.payload;
            const noteId = await this._service.addNote({ title, body, tags });

            return responseSuccess(h, 'Catatan berhasil ditambahkan', { noteId }, 201);
        } catch (error) {
            return responseError(error, h);
        }

    }

    async getNotesHandler(request, h) {
        const notes = await this._service.getNotes();

        return responseSuccess(h, 'Catatan berhasil didapatkan', { notes });
    }

    async getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = await this._service.getNoteById(id);

            return responseSuccess(h, 'Catatan berhasil didapatkan', { note });
        } catch (error) {
            return responseError(error, h);
        }

    }

    async putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);

            const { id } = request.params;
            await this._service.editNoteById(id, request.payload);

            return responseSuccess(h, 'Catatan berhasil diperbarui');
        } catch (error) {
            return responseError(error, h);
        }
    }

    async deleteNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;

            await this._service.deleteNoteById(id);

            return responseSuccess(h, 'Catatan berhasil dihapus');
        } catch (error) {
            return responseError(error, h);
        }

    }

}

module.exports = NotesHandler;