// models/Artist.js
const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const artistSchema = new Schema({
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
    avatar: {
        type: String
    },
    bio: {
        type: String
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
});

const Artist = mongoose.model("Artist", artistSchema, "artists");
module.exports = Artist;