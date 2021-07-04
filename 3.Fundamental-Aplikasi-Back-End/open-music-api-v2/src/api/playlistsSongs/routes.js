const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.getSongsOnPlaylistHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.deleteSongOnPlaylistByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;