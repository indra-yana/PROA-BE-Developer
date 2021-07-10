const { NotePayloadSchema } = require("./schema")
const InvariantError = require('../../exceptions/InvariantError');

const NotesValidator = {
    validateNotePayload: (payload) => {
        const validationResult = NotePayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError({ 
                message: 'Gagal validasi', 
                error: validationResult.error, 
                tags: ['NotesValidator', 'validateNotePayload'], 
            });
        }
    }
}

module.exports = NotesValidator;