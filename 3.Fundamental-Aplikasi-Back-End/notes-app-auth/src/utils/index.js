const ClientError = require('../exceptions/ClientError');

const mapNotesDBToModel = ({
    id,
    title,
    body,
    tags,
    created_at,
    updated_at
}) => ({
    id,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
});

const responseSuccess = (h, message, params = {}, statusCode = 200) => {
    return h.response({
        status: 'success',
        message,
        data: params,
    }).code(statusCode);
}

const responseError = (error, h) => {
    if (error instanceof ClientError) {
        return h.response({
            status: 'fail',
            message: error.message,
        }).code(error.statusCode);
    }

    // Server Error!
    console.error(error);
    return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
    }).code(500);
}

module.exports = { 
    mapNotesDBToModel,
    responseSuccess,
    responseError,
};