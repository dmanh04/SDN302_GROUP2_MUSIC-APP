    const mongoose = require("mongoose");
    const { Schema } = require('mongoose');
    const slugify = require('slugify');

    const genreSchema = new Schema({
        thumbnail: {
            type: String,
            default: "https://acemusic.com.vn/wp-content/uploads/2023/03/ace-6-1.jpg"
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxLength: 50
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true //thêm index để tối ưu việc tìm kiếm theo slug
        },
        description: {
            type: String,
            default: "Không có mô tả",
            maxLength: 300
        },
        songs: [{
            type: Schema.Types.ObjectId,
            ref: "Song"
        }]
    }, { timestamps: true });

    //Tự động tạo 'slug' trước khi lưu
    genreSchema.pre('save', function (next) {
        if (this.isModified('name') || this.isNew) {
            // Hàm chuyển đổi 'name' thành 'slug' (cần cài đặt thư viện slugify/v.v.)
            this.slug = slugify(this.name, {
                lower: true,
                strict: true //Loại bỏ các ký tự không an toàn
            });
        }
        next();
    });

    const Genre = mongoose.model("Genre", genreSchema, "genres");
    module.exports = Genre;