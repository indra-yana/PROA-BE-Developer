const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['NotesValidator', 'validateNotePayload'], 
            });
        }
    }
}

module.exports = UsersValidator;