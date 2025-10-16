const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const songArtistSchema = new Schema({
    song_id: {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
    artist_id: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
}, { timestamps: false });

songArtistSchema.index({ song_id: 1, artist_id: 1 }, { unique: true });

const SongArtist = mongoose.model("SongArtist", songArtistSchema, "song_artists");
module.exports = SongArtist;