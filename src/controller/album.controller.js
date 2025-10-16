const Album = require('../models/albums.model');
const Song = require('../models/songs.model'); // Cần để lấy các bài hát trong album

// Tạo mới Album
exports.create = async (req, res) => {
    try {
        const album = new Album(req.body);
        await album.save();
        res.status(201).send(album);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Albums
exports.findAll = async (req, res) => {
    try {
        const albums = await Album.find({}).populate('artists_id');
        res.status(200).send(albums);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Album theo ID
exports.findOne = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('artists_id');
        if (!album) {
            return res.status(404).send({ message: "Album not found" });
        }
        res.status(200).send(album);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Album theo ID
exports.update = async (req, res) => {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!album) {
            return res.status(404).send({ message: "Album not found" });
        }
        res.status(200).send(album);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Album theo ID
exports.delete = async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
            return res.status(404).send({ message: "Album not found" });
        }
        res.status(200).send({ message: "Album deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy tất cả bài hát thuộc Album này
exports.getAlbumSongs = async (req, res) => {
    try {
        const songs = await Song.find({ album_id: req.params.id }).populate('artists_id genres_id');
        res.status(200).send(songs);
    } catch (error) {
        res.status(500).send(error);
    }
};