const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const refreshTokenSchema = new Schema({
    refresh_token: {
        type: String, 
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false
    },
    account_id: {
        type: Schema.Types.ObjectId, 
        ref: "Account",
        required: true,
        maxlength: 255 
    },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema, "refresh_token");
module.exports = RefreshToken;