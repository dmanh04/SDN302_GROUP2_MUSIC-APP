const Artist = require('../models/artists.model');

// Tạo mới Artist
exports.create = async (req, res) => {
    try {
        const artist = new Artist(req.body);
        await artist.save();
        res.status(201).send(artist);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Artists
exports.findAll = async (req, res) => {
    try {
        const artists = await Artist.find({});
        res.status(200).send(artists);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Artist theo ID
exports.findOne = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).send({ message: "Artist not found" });
        }
        res.status(200).send(artist);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Artist theo ID
exports.update = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!artist) {
            return res.status(404).send({ message: "Artist not found" });
        }
        res.status(200).send(artist);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Artist theo ID
exports.delete = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) {
            return res.status(404).send({ message: "Artist not found" });
        }
        res.status(200).send({ message: "Artist deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};