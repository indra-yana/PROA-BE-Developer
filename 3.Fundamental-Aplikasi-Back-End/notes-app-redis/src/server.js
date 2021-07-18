const dotenv = require('dotenv').config();
const path = require('path');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// Notes Plugin
const notesPlugin = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// Users Plugin
const usersPlugin = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Auth Plugin
const authPlugin = require('./api/auth');
const AuthService = require('./services/postgres/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthValidator = require('./validator/auth');

// Collaborations
const collaborationPlugin = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const exportsPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploadsPlugin = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/redis/CacheService');

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
    const cacheService = new CacheService();
    const collabService = new CollaborationsService(cacheService);
    const notesService = new NotesService(collabService, cacheService);
    const usersService = new UsersService();
    const authService = new AuthService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // Mendefinisikan strategi authentikasi jwt
    server.auth.strategy('notesapp_jwt', 'jwt', {
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
        })
    })

    await server.register([
        {
            plugin: notesPlugin,
            options: {
                service: notesService,
                validator: NotesValidator,
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
            plugin: collaborationPlugin,
            options: {
                collaborationsService: collabService,
                notesService,
                validator: CollaborationsValidator,
            }
        }, 
        {
            plugin: exportsPlugin,
            options: {
                service: ProducerService,
                validator: ExportsValidator,
            }
        }, 
        {
            plugin: uploadsPlugin,
            options: {
              service: storageService,
              validator: UploadsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

init();