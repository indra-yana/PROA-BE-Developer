const { nanoid } = require("nanoid")
const books = require('./books');

const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    }

    books.push({
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    });

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (!isSuccess) {
        return h.response({
            status: "error",
            message: "Buku gagal ditambahkan"
        }).code(500);
    }

    return h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
            bookId: id,
        },
    }).code(201);
}

const getAllBookHandler = (request, h) => {

    const { name, reading, finished } = request.query;
    const data = { books };
    
    if (name) {
        const limit = 2;
        data.books = data.books
            .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
            .slice(0, limit);
    }

    if (reading == 0 || reading == 1) {
        const limit = 2;
        data.books = data.books
            .filter((book) => book.reading == reading)
            .slice(0, limit);
    }

    if (finished == 0 || finished == 1) {
        const limit = finished == 1 ? 1 : 3;
        data.books = data.books
            .filter((book) => book.finished == finished)
            .slice(0, limit);
    }

    data.books = data.books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    return {
        status: 'success',
        data,
    }
}

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (!book) {
        return h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        }).code(404);
    }

    return h.response({
        status: "success",
        data: {
            book,
        }
    }).code(200);
}

const editBookByIdhandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (!name) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        }

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
    }

    return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404);
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);

        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    }).code(404);
}

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdhandler,
    deleteBookByIdHandler,
}