const { default: slugify } = require('slugify');
const Genre = require('../models/genres.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');

exports.getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        if (genres.length === 0) {
            return res.status(404).json(notFound("Không tồn tại thể loại nào"));
        }
        const formattedGenre = genres.map((g) => ({
            _id: g._id,
            name: g.name,
            slug: g.slug,
            description: g.description,
            thumbnail: g.thumbnail,
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
            songs: g.songs
        }));
        res.status(200).json(ok(formattedGenre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
}

exports.createGenre = async (req, res) => {
    const { name, description, thumbnail } = req.body;

    if (!name) {
        return res.status(400).json(badRequest("Tên thể loại (name) là bắt buộc."));
    }

    try {
        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(400).json(badRequest("Thể loại này đã tồn tại."));
        }

        const newGenre = new Genre({
            name,
            description,
            thumbnail
        });

        await newGenre.save();
        res.status(201).json(created(newGenre.toObject(), "Tạo thể loại thành công."));
    } catch (error) {
        console.error('Lỗi khi tạo thể loại:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json(badRequest(error.message));
        }

        res.status(500).json(internalError(error.message));
    }
}

exports.deleteGenre = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(400).json(badRequest("Thể loại này không tồn tại."))
        }
        res.status(204).json(ok(genre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
}

exports.updateGenre = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json(badRequest("Vui lòng cung cấp ít nhất 1 trường để cập nhật."))
    }

    try {
        const updateGenre = await Genre.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )

        if (!updateGenre) {
            return res.status(404).json(notFound("Không tìm thấy thể loại để cập nhật"));
        }

        if (updateData.name) {
            const newSlug = slugify(updateData.name, { lower: true, strict: true });
            updateGenre.slug = newSlug;
            await updateGenre.save();
        }

        res.status(200).json(ok(updateGenre.toObject(), "Cập nhật thể loại thành công"))
    } catch (error) {
        console.error('Lỗi khi cập nhật thể loại:', error);

        if (error.name === 'ValidationError' || error.code === 11000) { // 11000 là lỗi trùng lặp MongoDB
            return res.status(400).json(badRequest("Dữ liệu cập nhật không hợp lệ (có thể tên bị trùng)."));
        }

        res.status(500).json(internalError(error.message));
    }
}