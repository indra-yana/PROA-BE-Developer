const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError({
                message: 'Gagal validasi',
                error: validationResult.error,
                tags: ['CollaborationsValidator', 'validateCollaborationPayload'],
            });
        }
    },
}

module.exports = CollaborationsValidator;