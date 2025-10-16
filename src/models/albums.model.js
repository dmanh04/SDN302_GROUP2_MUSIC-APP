const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const albumSchema = new Schema({
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
    image: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    status: {
        type: String,
        maxlength: 255
    },
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    artists_id: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
});

const Album = mongoose.model("Album", albumSchema, "albums");
module.exports = Album;