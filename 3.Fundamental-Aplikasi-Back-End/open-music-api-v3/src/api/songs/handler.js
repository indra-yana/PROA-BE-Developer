const { responseSuccess, responseError } = require('../../utils');

class SongsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const { title = 'Untitled', year, performer, genre, duration } = request.payload;
            const songId = await this._service.addSong({ title, year, performer, genre, duration });

            return responseSuccess(h, 'Lagu berhasil ditambahkan', { songId }, 201);
        } catch (error) {
            return responseError(h, error);
        }

    }

    async getSongsHandler(request, h) {
        try {
            const songs = await this._service.getSongs();

            return responseSuccess(h, 'Lagu berhasil didapatkan', { songs });  
        } catch (error) {
            return responseError(h, error);
        }
        
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);

            return responseSuccess(h, 'Lagu berhasil didapatkan', { song });
        } catch (error) {
            return responseError(h, error);
        }

    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const { id } = request.params;
            await this._service.editSongById(id, request.payload);

            return responseSuccess(h, 'Lagu berhasil diperbarui');
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;

            await this._service.deleteSongById(id);

            return responseSuccess(h, 'Lagu berhasil dihapus');
        } catch (error) {
            return responseError(h, error);
        }

    }

}

module.exports = SongsHandler;