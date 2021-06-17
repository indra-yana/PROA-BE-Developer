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

module.exports = { mapSongsDBToModel, mapSongsDBToModel2 };