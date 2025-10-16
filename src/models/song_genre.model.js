const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const songGenreSchema = new Schema({
    song_id: {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
    genre_id: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    },
}, { timestamps: false });


songGenreSchema.index({ song_id: 1, genre_id: 1 }, { unique: true });

const SongGenre = mongoose.model("SongGenre", songGenreSchema, "song_genre");
module.exports = SongGenre;