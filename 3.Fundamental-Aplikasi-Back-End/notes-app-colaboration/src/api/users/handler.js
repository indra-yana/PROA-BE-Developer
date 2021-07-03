const { responseSuccess, responseError } = require('../../utils');

class UsersHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
        this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
    }

    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);

            const { username, password, fullname } = request.payload;
            const userId = await this._service.addUser({ username, password, fullname });

            return responseSuccess(h, 'User berhasil ditambahkan', { userId }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

    async getUserByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const user = await this._service.getUserById(id);

            return responseSuccess(h, 'User berhasil didapatkan', { user });
        } catch (error) {
            return responseError(h, error);
        }
    }

    async getUsersByUsernameHandler(request, h) {
        try {
            const { username = '' } = request.query;
            const users = await this._service.getUsersByUsername(username);
            
            return responseSuccess(h, 'User berhasil didapatkan', { users });
        } catch (error) {
            return responseError(h, error);
        }
    }

}

module.exports = UsersHandler;