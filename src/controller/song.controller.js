const Song = require('../models/songs.model');
const SongStatistic = require('../models/song_statistic.model');

// Tạo mới Song
exports.create = async (req, res) => {
    try {
        const song = new Song(req.body);
        await song.save();

        // Tạo mục thống kê tương ứng (1:1)
        const stats = new SongStatistic({ _id: song._id, likes: 0, views: 0 });
        await stats.save();

        res.status(201).send(song);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Lấy tất cả Songs
exports.findAll = async (req, res) => {
    try {
        const songs = await Song.find({})
            .populate('album_id')
            .populate('artists_id')
            .populate('genres_id');
        res.status(200).send(songs);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy Song theo ID
exports.findOne = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
            .populate('album_id')
            .populate('artists_id')
            .populate('genres_id');

        if (!song) {
            return res.status(404).send({ message: "Song not found" });
        }

        // Tăng lượt xem (views)
        await SongStatistic.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.status(200).send(song);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Cập nhật Song theo ID
exports.update = async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!song) {
            return res.status(404).send({ message: "Song not found" });
        }
        res.status(200).send(song);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Xóa Song theo ID
exports.delete = async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).send({ message: "Song not found" });
        }
        // Xóa thống kê tương ứng
        await SongStatistic.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Song deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Lấy thống kê của bài hát
exports.getStatistics = async (req, res) => {
    try {
        const stats = await SongStatistic.findById(req.params.id);
        if (!stats) {
            return res.status(404).send({ message: "Statistics not found for this song" });
        }
        res.status(200).send(stats);
    } catch (error) {
        res.status(500).send(error);
    }
};