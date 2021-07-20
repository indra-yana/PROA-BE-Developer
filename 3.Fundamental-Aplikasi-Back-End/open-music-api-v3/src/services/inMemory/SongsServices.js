const { nanoid } = require("nanoid");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsDBToModel2, mapSongsDBToModel } = require("../../utils");

class SongsService {

    constructor() {
        this._songs = [];
    }

    async addSong({ title, year, performer, genre, duration }) {
        const tags = ['SongsService', 'addSong'];
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const newSong = {
            id, title, year, performer, genre, duration, inserted_at: insertedAt, updated_at: updatedAt, 
        }

        this._songs.push(newSong);
        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    
        if (!isSuccess) {
            throw new InvariantError({ message: 'Lagu gagal ditambahkan', tags });
        }

        return id;
    }

    async getSongs() {
        return this._songs.map(mapSongsDBToModel2);
    }

    async getSongById(id) {
        const tags = ['SongsService', 'getSongById'];
        const song = this._songs.filter((song) => song.id === id).map(mapSongsDBToModel)[0];

        if (!song) {
            throw new NotFoundError({ message: 'Lagu tidak ditemukan', tags })
        }

        return song;
    }

    async editSongById(id, { title, year, performer, genre, duration }) {
        const tags = ['SongsService', 'editSongById'];
        const index = this._songs.findIndex((song) => song.id === id);
        const updatedAt = new Date().toISOString();

        if (index === -1) {
            throw new NotFoundError({ message: 'Gagal memperbarui lagu. Id tidak ditemukan', tags });
        }

        this._songs[index] = {
            ...this._songs[index], title, year, performer, genre, duration, updatedAt,
        }
    }

    async deleteSongById(id) {
        const tags = ['SongsService', 'deleteSongById'];
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError({ message: 'Lagu gagal dihapus. Id tidak ditemukan', tags });
        }

        this._songs.splice(index, 1);
    }

}

module.exports = SongsService;