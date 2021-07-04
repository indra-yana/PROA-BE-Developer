const dotenv = require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Songs Plugin
const songsPlugin = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// Users Plugin
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Auth Plugin
const authPlugin = require('./api/auth');
const AuthService = require('./services/postgres/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthValidator = require('./validator/auth');

// Playlist Plugin
const playlistsPlugin = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const init = async() => {
    const server = Hapi.server({
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Init Service Instance
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authService = new AuthService();
    const playlistsService = new PlaylistsService();

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    // Mendefinisikan strategi authentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            }
        }),
    });

    // registrasi plugin internal
    await server.register([
        {
            plugin: songsPlugin,
            options: {
                service: songsService,
                validator: SongsValidator,
            }
        },
        {
            plugin: usersPlugin,
            options: {
                service: usersService,
                validator: UsersValidator,
            }
        },
        {
            plugin: authPlugin,
            options: {
                authService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthValidator,
            }
        }, 
        {
            plugin: playlistsPlugin,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            }
        },
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();