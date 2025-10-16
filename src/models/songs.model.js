const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const songSchema = new Schema({
    created_by: {
        type: String,
        maxlength: 50
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    last_modified_by: {
        type: String,
        maxlength: 50
    },
    last_modified_date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        required: true
    },
    file_path: {
        type: String
    },
    image: {
        type: String
    },
    lyric: {
        type: String
    },
    policy: {
        type: String,
        maxlength: 255
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    album_id: {
        type: Schema.Types.ObjectId,
        ref: "Album"
    },
    artists_id: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
    genres_id: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true
    }
});

const Song = mongoose.model("Song", songSchema, "songs");
module.exports = Song;