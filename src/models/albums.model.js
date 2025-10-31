const mongoose = require("mongoose");
const { Schema } = require('mongoose');
const slugify = require('slugify');

const albumSchema = new Schema({
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    last_modified_by: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    image: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        maxlength: 255,
        lowercase: true,
        index: true //thêm index để tối ưu việc tìm kiếm theo slug

    },
    status: {
        type: String,
        maxlength: 255
    },
    title: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    artist: [{
        type: Schema.Types.ObjectId,
        ref: "Artist"
    }],
    songs: [{
        type: Schema.Types.ObjectId,
        ref: "Song"
    }]
}, { timestamps: true });

//Tự động tạo 'slug' trước khi lưu
albumSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) {
        // Hàm chuyển đổi 'title' thành 'slug' (cần cài đặt thư viện slugify/v.v.)
        this.slug = slugify(this.title, {
            lower: true,
            strict: true //Loại bỏ các ký tự không an toàn
        });
    }
    next();
});

const Album = mongoose.model("Album", albumSchema, "albums");
module.exports = Album;