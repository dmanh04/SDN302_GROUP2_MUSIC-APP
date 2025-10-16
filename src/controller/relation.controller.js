const SongLike = require('../models/song_likes.model');
const AccountRole = require('../models/account_roles.model');
const SongGenre = require('../models/song_genre.model');
const SongArtist = require('../models/song_artists.model');
const SongStatistic = require('../models/song_statistic.model');

// ---------------------- Song Likes ----------------------

// POST: Like một bài hát
exports.likeSong = async (req, res) => {
    const { song_id, account_id } = req.body;
    try {
        const existingLike = await SongLike.findOne({ song_id, account_id });
        if (existingLike) {
            return res.status(409).send({ message: "Song already liked by this user" });
        }
        const like = new SongLike({ song_id, account_id });
        await like.save();

        // Tăng số lượng likes trong SongStatistic
        await SongStatistic.findByIdAndUpdate(song_id, { $inc: { likes: 1 } });

        res.status(201).send({ message: "Song liked successfully" });
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Bỏ like một bài hát
exports.unlikeSong = async (req, res) => {
    const { song_id, account_id } = req.body; // Lấy từ body hoặc query
    try {
        const result = await SongLike.findOneAndDelete({ song_id, account_id });

        if (!result) {
            return res.status(404).send({ message: "Like not found" });
        }

        // Giảm số lượng likes trong SongStatistic
        await SongStatistic.findByIdAndUpdate(song_id, { $inc: { likes: -1 } });

        res.status(200).send({ message: "Song unliked successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// GET: Lấy danh sách bài hát đã thích của một người dùng
exports.getAccountLikes = async (req, res) => {
    try {
        const likes = await SongLike.find({ account_id: req.params.accountId })
            .populate('song_id');
        res.status(200).send(likes.map(like => like.song_id));
    } catch (error) {
        res.status(500).send(error);
    }
};

// ---------------------- Account Roles ----------------------

// POST: Gán Role cho Account
exports.assignRole = async (req, res) => {
    const { account_id, role_id } = req.body;
    try {
        const roleAssignment = new AccountRole({ account_id, role_id });
        await roleAssignment.save();
        res.status(201).send(roleAssignment);
    } catch (error) {
        // Xử lý lỗi trùng lặp nếu index duy nhất được thiết lập
        res.status(400).send(error);
    }
};

// DELETE: Gỡ Role khỏi Account
exports.unassignRole = async (req, res) => {
    const { account_id, role_id } = req.body;
    try {
        const result = await AccountRole.findOneAndDelete({ account_id, role_id });
        if (!result) {
            return res.status(404).send({ message: "Role assignment not found" });
        }
        res.status(200).send({ message: "Role unassigned successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// ---------------------- Song Genres ----------------------

// POST: Gán Genre cho Song
exports.addSongGenre = async (req, res) => {
    const { song_id, genre_id } = req.body;
    try {
        const songGenre = new SongGenre({ song_id, genre_id });
        await songGenre.save();
        res.status(201).send(songGenre);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Gỡ Genre khỏi Song
exports.removeSongGenre = async (req, res) => {
    const { song_id, genre_id } = req.body;
    try {
        const result = await SongGenre.findOneAndDelete({ song_id, genre_id });
        if (!result) {
            return res.status(404).send({ message: "Song-Genre link not found" });
        }
        res.status(200).send({ message: "Song-Genre link removed successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

// ---------------------- Song Artists ----------------------

// POST: Thêm Artist vào Song
exports.addSongArtist = async (req, res) => {
    const { song_id, artist_id } = req.body;
    try {
        const songArtist = new SongArtist({ song_id, artist_id });
        await songArtist.save();
        res.status(201).send(songArtist);
    } catch (error) {
        res.status(400).send(error);
    }
};

// DELETE: Xóa Artist khỏi Song
exports.removeSongArtist = async (req, res) => {
    const { song_id, artist_id } = req.body;
    try {
        const result = await SongArtist.findOneAndDelete({ song_id, artist_id });
        if (!result) {
            return res.status(404).send({ message: "Song-Artist link not found" });
        }
        res.status(200).send({ message: "Song-Artist link removed successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};