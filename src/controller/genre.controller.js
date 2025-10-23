const Genre = require('../models/genres.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');

// Tạo mới Genre
exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json(badRequest('Tên thể loại không được để trống'));
        }

        const genre = new Genre({ name });
        await genre.save();
        
        res.status(201).json(created(genre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy tất cả Genres
exports.findAll = async (req, res) => {
    try {
        const genres = await Genre.find({});
        res.status(200).json(ok(genres));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy Genre theo ID
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findById(id);
        
        if (!genre) {
            return res.status(404).json(notFound('Thể loại không tìm thấy'));
        }
        
        res.status(200).json(ok(genre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Cập nhật Genre theo ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json(badRequest('Tên thể loại không được để trống'));
        }

        const genre = await Genre.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        
        if (!genre) {
            return res.status(404).json(notFound('Thể loại không tìm thấy'));
        }
        
        res.status(200).json(ok(genre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Xóa Genre theo ID
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const genre = await Genre.findByIdAndDelete(id);
        
        if (!genre) {
            return res.status(404).json(notFound('Thể loại không tìm thấy'));
        }
        
        res.status(200).json(ok(null));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};
