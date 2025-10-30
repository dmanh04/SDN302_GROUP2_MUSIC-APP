const mongoose = require("mongoose");
const { Schema } = require('mongoose');
const bcrypt = require("bcryptjs"); 

const accountSchema = new Schema({
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
    active: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        maxlength: 255,
        unique: true,
        required: true
    },
    password_hash: {
        type: String,
        maxlength: 255,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role"
    }]
}, { timestamps: false });

accountSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password_hash")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password_hash, salt); 
    user.password_hash = hash; // gán lại
    next();
  } catch (err) {
    next(err);
  }
});

accountSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;
