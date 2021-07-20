const { SongPayloadSchema } = require("./schema")
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const tags = ['SongsValidator'];
        const validationResult = SongPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal Validasi', 
                error: validationResult.error,
                tags, 
            });
        }
    }
}

module.exports = SongsValidator;