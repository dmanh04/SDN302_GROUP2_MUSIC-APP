const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const songLikeSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    account_id: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    song_id: {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
});

songLikeSchema.index({ account_id: 1, song_id: 1 }, { unique: true });

const SongLike = mongoose.model("SongLike", songLikeSchema, "song_likes");
module.exports = SongLike;