/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        name: {
            type: 'varchar(150)',
            notNull: true,
        },
        owner: {
            type: 'varchar(50)',
            notNull: false,
        },
    });

    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
    pgm.dropTable('playlists');
};
