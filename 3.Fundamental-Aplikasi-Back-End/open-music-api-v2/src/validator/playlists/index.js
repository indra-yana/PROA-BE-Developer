const { PlaylistPayloadSchema } = require("./schema")
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const tags = ['PlaylistsValidator'];
        const validationResult = PlaylistPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal Validasi', 
                error: validationResult.error,
                tags, 
            });
        }
    }
}

module.exports = PlaylistsValidator;