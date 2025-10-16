const Genre = require('../models/genres.model');

// Tạo mới Genre
exports.create = async (req, res) => {
    try {
        const genre = new Genre(req.body);
        await genre.save();
        res.status(201).send(genre);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Genres
exports.findAll = async (req, res) => {
    try {
        const genres = await Genre.find({});
        res.status(200).send(genres);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Genre theo ID
exports.findOne = async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).send({ message: "Genre not found" });
        }
        res.status(200).send(genre);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Genre theo ID
exports.update = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!genre) {
            return res.status(404).send({ message: "Genre not found" });
        }
        res.status(200).send(genre);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Genre theo ID
exports.delete = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) {
            return res.status(404).send({ message: "Genre not found" });
        }
        res.status(200).send({ message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};