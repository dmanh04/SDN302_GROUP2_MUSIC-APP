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

