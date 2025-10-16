// models/Account.js
const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const accountSchema = new Schema({
    created_by: {
        type: String,
        maxlength: 50
    },
    created_date: {
        type: Date,
        default: Date.now // timestamp(6) with time zone
    },
    last_modified_by: {
        type: String,
        maxlength: 50
    },
    last_modified_date: {
        type: Date,
        default: Date.now // timestamp(6) with time zone
    },
    active: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String // text
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    password_hash: {
        type: String,
        required: true,
        maxlength: 255
    },
   
});

const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;