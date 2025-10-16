const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
}, { timestamps: false });

const Genre = mongoose.model("Genre", genreSchema, "genres");
module.exports = Genre;