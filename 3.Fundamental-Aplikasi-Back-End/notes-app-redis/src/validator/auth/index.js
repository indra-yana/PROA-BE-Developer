const {
    PostAuthPayloadSchema,
    PutAuthPayloadSchema,
    DeleteAuthPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthValidator = {
    validatePostAuthPayload: (payload) => {
        const validationResult = PostAuthPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['AuthValidator', 'validatePostAuthPayload'], 
            });
        }
    },
    validatePutAuthPayload: (payload) => {
        const validationResult = PutAuthPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['AuthValidator', 'validatePutAuthPayload'], 
            });
        }
    },
    validateDeleteAuthPayload: (payload) => {
        const validationResult = DeleteAuthPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['AuthValidator', 'validateDeleteAuthPayload'], 
            });
        }
    },
}

module.exports = AuthValidator;