const { ExportNotesPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportNotesPayload: (payload) => {
        const validationResult = ExportNotesPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['ExportsValidator', 'validateExportNotesPayload'], 
            });
        }
    },
}

module.exports = ExportsValidator;