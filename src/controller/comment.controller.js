const Comment = require('../models/comments.model');
const { ok, created, badRequest, notFound, internalError, forbidden } = require('../utils/baseResponse');

// Lấy tất cả comments
exports.findAll = async (req, res) => {
    try {
        const { song_id } = req.query;

        let query = {};
        if (song_id) {
            query.song_id = song_id;
        }

        const comments = await Comment.find(query)
            .populate('account_id', 'email avatar')
            .populate('song_id', 'title')
            .populate('parent_id')
            .sort({ created_date: -1 });

        res.status(200).json(ok(comments));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách comments:', error);
        res.status(500).json(internalError(error.message));
    }
};

// Lấy 1 comment theo ID
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id)
            .populate('account_id', 'email avatar')
            .populate('song_id', 'title')
            .populate('parent_id');

        if (!comment) {
            return res.status(404).json(notFound('Không tìm thấy comment'));
        }

        res.status(200).json(ok(comment));
    } catch (error) {
        console.error('Lỗi khi lấy comment:', error);
        res.status(500).json(internalError(error.message));
    }
};

// Tạo comment mới
exports.create = async (req, res) => {
    try {
        const { content, song_id, parent_id } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json(badRequest('Nội dung comment không được để trống'));
        }

        if (!song_id) {
            return res.status(400).json(badRequest('song_id là bắt buộc'));
        }

        const newComment = new Comment({
            content: content.trim(),
            account_id: userId,
            song_id,
            parent_id: parent_id || null,
            created_by: userId
        });

        await newComment.save();

        const populatedComment = await Comment.findById(newComment._id)
            .populate('account_id', 'email avatar')
            .populate('song_id', 'title');

        res.status(201).json(created(populatedComment));
    } catch (error) {
        console.error('Lỗi khi tạo comment:', error);
        res.status(500).json(internalError(error.message));
    }
};

// Cập nhật comment
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const userRoles = req.user.roles || [];

        // Kiểm tra comment tồn tại
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json(notFound('Không tìm thấy comment'));
        }

        // Kiểm tra quyền: Admin hoặc chính chủ
        const isAdmin = userRoles.includes('ADMIN');
        const isOwner = comment.created_by === userId;

        if (!isAdmin && !isOwner) {
            return res.status(403).json(forbidden('Bạn không có quyền chỉnh sửa comment này'));
        }

        // Validate content
        if (!content || content.trim() === '') {
            return res.status(400).json(badRequest('Nội dung comment không được để trống'));
        }

        // Cập nhật
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            {
                content: content.trim(),
                last_modified_by: userId
            },
            { new: true, runValidators: true }
        ).populate('account_id', 'email avatar')
            .populate('song_id', 'title');

        res.status(200).json(ok(updatedComment));
    } catch (error) {
        console.error('Lỗi khi cập nhật comment:', error);
        res.status(500).json(internalError(error.message));
    }
};

// Xóa comment
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRoles = req.user.roles || [];

        // Kiểm tra comment tồn tại
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json(notFound('Không tìm thấy comment'));
        }

        // Kiểm tra quyền: Admin hoặc chính chủ
        const isAdmin = userRoles.includes('ADMIN');
        const isOwner = comment.created_by === userId;

        if (!isAdmin && !isOwner) {
            return res.status(403).json(forbidden('Bạn không có quyền xóa comment này'));
        }

        // Xóa comment
        await Comment.findByIdAndDelete(id);

        res.status(200).json(ok({ message: 'Xóa comment thành công' }));
    } catch (error) {
        console.error('Lỗi khi xóa comment:', error);
        res.status(500).json(internalError(error.message));
    }
};

// Lấy replies của một comment
exports.getReplies = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json(notFound('Không tìm thấy comment'));
        }

        const replies = await Comment.find({ parent_id: id })
            .populate('account_id', 'email avatar')
            .populate('song_id', 'title')
            .sort({ created_date: 1 });

        res.status(200).json(ok(replies));
    } catch (error) {
        console.error('Lỗi khi lấy replies:', error);
        res.status(500).json(internalError(error.message));
    }
};

