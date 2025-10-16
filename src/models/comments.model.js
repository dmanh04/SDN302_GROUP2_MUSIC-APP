const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const commentSchema = new Schema({
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
    content: {
        type: String,
        required: true,
        maxlength: 255
    },
    account_id: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    song_id: {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
});

const Comment = mongoose.model("Comment", commentSchema, "comments");
module.exports = Comment;