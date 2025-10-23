const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const refreshTokenSchema = new Schema({
    refresh_token: {
        type: String,
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    account_id: {
        type: String,
        maxlength: 255,
        required: true
    }
}, { timestamps: false });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema, "refresh_token");
module.exports = RefreshToken;
