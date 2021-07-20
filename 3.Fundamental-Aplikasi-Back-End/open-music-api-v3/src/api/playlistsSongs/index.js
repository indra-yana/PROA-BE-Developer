const PlaylistsSongsHandler = require("./handler")
const routes = require('./routes');

module.exports = {
    name: 'playlists songs',
    version: '1.0.0',
    register: async (server, { playlistsSongsService, playlistsService, validator }) => {
        const playlistsSongsHandler = new PlaylistsSongsHandler(playlistsSongsService, playlistsService, validator);

        server.route(routes(playlistsSongsHandler));
    },
};