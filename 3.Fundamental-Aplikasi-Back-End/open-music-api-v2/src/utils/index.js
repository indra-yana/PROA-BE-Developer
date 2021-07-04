const ClientError = require('../exceptions/ClientError');
const ServerError = require('../exceptions/ServerError');

const mapSongsDBToModel = ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration,
    inserted_at,
    updated_at
}) => ({
    id, 
    title, 
    year: Number(year), 
    performer, 
    genre, 
    duration: Number(duration),
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

const mapSongsDBToModel2 = ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration,
    inserted_at,
    updated_at
}) => ({
    id,
    title,
    performer,
});

const responseSuccess = (h, message, params = {}, statusCode = 200) => {
    return h.response({
        status: 'success',
        message,
        data: params,
    }).code(statusCode);
}

const responseError = (h, error) => {
    if (error instanceof ClientError) {
        return h.response({
            status: 'fail',
            message: error.message,
        }).code(error.statusCode);
    } else if (error instanceof ServerError) {
        return h.response({
            status: 'error',
            message: error.message,
        }).code(error.statusCode);
    }

    // Not Specified Error
    console.error(error);
    return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan yang tak terduga pada server kami.',
    }).code(500);
}

module.exports = { 
    mapSongsDBToModel, 
    mapSongsDBToModel2,
    responseSuccess,
    responseError,
};