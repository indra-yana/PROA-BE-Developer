const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const id = nanoid(16);
    const { title, body, tags } = request.payload;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newNote = {
        id, title, body, tags, createdAt, updatedAt, 
    }

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan!',
            data: {
                noteId: id,
            },
        }).code(201);

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan!',
    }).code(500);

    return response;
}

const getAllNotesHandler = () => {
    console.log(notes);
    return {
        status: 'success',
        data: {
            notes,
        }
    }
}

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((n) => n.id === id )[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        }
    }

    const response = h.response({
        status: 'fail', 
        message: 'Catatan tidak ditemukan',
    }).code(404);

    return response;
}

const editNoteByIdhandler = (request, h) => {
    const { id } = request.params;
    const { title, body, tags } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            body,
            tags,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui!',
        }).code(200);

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan!',
    }).code(404);

    return response;
}

const deleteNoteByIdhandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }).code(200);

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    }).code(404);

    return response;
}

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler,
    editNoteByIdhandler,
    deleteNoteByIdhandler, 
};