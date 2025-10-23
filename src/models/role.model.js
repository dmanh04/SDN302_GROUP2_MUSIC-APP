const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const roleSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true
    },
    id: {
        type: String,
        maxlength: 255
    }
}, { timestamps: false });

const Role = mongoose.model("Role", roleSchema, "roles");
module.exports = Role;
