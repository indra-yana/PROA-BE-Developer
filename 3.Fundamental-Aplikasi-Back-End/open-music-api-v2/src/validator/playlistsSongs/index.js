const { PostSongToPlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsSongsValidator = {
    validatePostSongToPlaylistPayload: (payload) => {
        const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['PlaylistsSongsValidator', 'validatePostSongToPlaylistPayload'], 
            });
        }
    },
}

module.exports = PlaylistsSongsValidator;