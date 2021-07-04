const { responseSuccess, responseError } = require('../../utils');

class AuthHandler {

    constructor(authService, usersService, tokenManager, validator) {
        this._authService = authService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthHandler = this.postAuthHandler.bind(this);
        this.putAuthHandler = this.putAuthHandler.bind(this);
        this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
    }

    async postAuthHandler(request, h) {
        try {
            this._validator.validatePostAuthPayload(request.payload);

            const { username, password } = request.payload;
            const id = await this._usersService.verifyUserCredential(username, password);
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });

            await this._authService.addRefreshToken(refreshToken);

            return responseSuccess(h, 'Authentication berhasil ditambahkan', {
                accessToken,
                refreshToken,
            }, 201);
        } catch (error) {
            return responseError(h, error);
        }
    }

    async putAuthHandler(request, h) {
        try {
            this._validator.validatePutAuthPayload(request.payload);

            const { refreshToken } = request.payload;
            
            await this._authService.verifyRefreshToken(refreshToken);
            
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
            const accessToken = this._tokenManager.generateAccessToken({ id });

            return responseSuccess(h, 'Access Token berhasil diperbarui', { accessToken });
        } catch (error) {
            return responseError(h, error);
        }
    }

    async deleteAuthHandler(request, h) {
        try {
            this._validator.validateDeleteAuthPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._authService.verifyRefreshToken(refreshToken);
            await this._authService.deleteRefreshToken(refreshToken);

            return responseSuccess(h, 'Refresh token berhasil dihapus');
        } catch (error) {
            return responseError(h, error);
        }
    }

}

module.exports = AuthHandler;

