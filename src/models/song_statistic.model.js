const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const songStatisticSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
}, { _id: false });

const SongStatistic = mongoose.model("SongStatistic", songStatisticSchema, "song_statistic");
module.exports = SongStatistic;