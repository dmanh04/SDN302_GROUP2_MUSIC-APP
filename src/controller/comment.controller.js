const Comment = require('../models/comments.model');

// Tạo mới Comment
exports.create = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Comments (thường chỉ dùng cho admin/moderator)
exports.findAll = async (req, res) => {
    try {
        const comments = await Comment.find({})
            .populate('account_id', 'email')
            .populate('song_id', 'title');
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Comment theo ID
exports.findOne = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('account_id', 'email')
            .populate('parent_id');
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res.status(200).send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Comment theo ID
exports.update = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res.status(200).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Comment theo ID
exports.delete = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy tất cả comments của một bài hát cụ thể
exports.findCommentsBySong = async (req, res) => {
    try {
        const comments = await Comment.find({ song_id: req.params.songId })
            .populate('account_id', 'email avatar')
            .sort({ created_date: 1 }); // Sắp xếp theo thời gian tạo
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
};