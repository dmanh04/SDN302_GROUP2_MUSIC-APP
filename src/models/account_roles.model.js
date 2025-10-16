const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const accountRoleSchema = new Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        maxlength: 255
    },
    role_id: {
        type: Schema.Types.ObjectId, 
        ref: "Role",
        required: true,
    },
});
accountRoleSchema.index({ account_id: 1, role_id: 1 }, { unique: true });

const AccountRole = mongoose.model("AccountRole", accountRoleSchema, "account_roles");
module.exports = AccountRole;