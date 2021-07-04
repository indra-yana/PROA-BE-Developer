/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable('songs', {
        id: {
            type: 'varchar(100)',
            primaryKey: true,
        },
        title: {
            type: 'text',
            notNull: true,
        },
        year: {
            type: 'integer',
            notNull: false,
            default: null,
        },
        performer: {
            type: 'text',
            notNull: true,
        },
        genre: {
            type: 'text',
            notNull: false,
        },
        duration: {
            type: 'integer',
            notNull: false,
            default: '0',
        },
        inserted_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

};

exports.down = pgm => {
    pgm.dropTable('songs');
};
