const Song = require('../models/songs.model');
const Album = require('../models/albums.model');
const Artist = require('../models/artists.model');
const Genre = require('../models/genres.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');
const { uploadAnyBuffer } = require('./file.controller');
const { generateUniqueSlug } = require('../utils/helpers');


exports.create = async (req, res) => {
    try {
        const { title, duration, artists, genres, album_id, file_path, image, lyric, policy } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json(badRequest('Tên bài hát không được để trống'));
        }

        const resolvedSlug = await generateUniqueSlug(Song, title);

        if (!duration || duration <= 0) {
            return res.status(400).json(badRequest('Thời lượng phải lớn hơn 0'));
        }

        if (!artists || artists.length === 0) {
            return res.status(400).json(badRequest('Phải chọn ít nhất 1 nghệ sĩ'));
        }

        if (!genres || genres.length === 0) {
            return res.status(400).json(badRequest('Phải chọn ít nhất 1 thể loại'));
        }

        const artistDocs = await Artist.find({ _id: { $in: artists } });
        if (artistDocs.length !== artists.length) {
            return res.status(404).json(notFound('Một số nghệ sĩ không tồn tại'));
        }

        const genreDocs = await Genre.find({ _id: { $in: genres } });
        if (genreDocs.length !== genres.length) {
            return res.status(404).json(notFound('Một số thể loại không tồn tại'));
        }

        if (album_id) {
            const album = await Album.findById(album_id);
            if (!album) {
                return res.status(404).json(notFound('Album không tồn tại'));
            }
        }

        const files = req.files || {};
        const imageFile = files.image?.[0];
        const mediaFile = files.file_path?.[0];

        let uploadedImageUrl = typeof image === 'string' ? image : '';
        let uploadedFileUrl = typeof file_path === 'string' ? file_path : '';

        if (imageFile && imageFile.buffer) {
            const imageUrl = await uploadAnyBuffer(imageFile.buffer, 'zingmp5/files');
            uploadedImageUrl = imageUrl || uploadedImageUrl;
        }
        if (mediaFile && mediaFile.buffer) {
            const fileUrl = await uploadAnyBuffer(mediaFile.buffer, 'zingmp5/files');
            uploadedFileUrl = fileUrl || uploadedFileUrl;
        }

        const song = new Song({
            title,
            slug: resolvedSlug,
            duration,
            artists,
            genres,
            album_id: album_id || null,
            file_path: uploadedFileUrl || '',
            image: uploadedImageUrl || '',
            lyric: lyric || '',
            policy: policy || '',
            likes: 0,
            views: 0,
            liked_by: [],
            created_by: req.user?.id || 'system'
        });

        await song.save();

        await Artist.updateMany(
            { _id: { $in: artists } },
            { $push: { songs: song._id } }
        );

        if (album_id) {
            await Album.findByIdAndUpdate(album_id, { $push: { songs: song._id } });
        }

        const populatedSong = await song.populate(['artists', 'genres', 'album_id']);
        res.status(201).json(created(populatedSong));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy tất cả Songs
exports.findAll = async (req, res) => {
    try {
        const songs = await Song.find({})
            .populate('artists')
            .populate('genres')
            .populate('album_id');
        // .populate('liked_by');
        res.status(200).json(ok(songs));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id)
            .populate('artists')
            .populate('genres')
            .populate('album_id');
        // .populate('liked_by');

        if (!song) {
            return res.status(404).json(notFound('Bài hát không tìm thấy'));
        }

        // Tăng lượt xem
        song.views = (song.views || 0) + 1;
        await song.save();

        res.status(200).json(ok(song));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, duration, artists, genres, album_id, file_path, image, lyric, policy } = req.body;
        const existSong = await Song.findById(id);
        if (!title || title.trim() === '') {
            return res.status(400).json(badRequest('Tên bài hát không được để trống'));
        }
        // Decide slug: only regenerate if title changed
        let resolvedSlug = existSong?.slug || '';
        if (title && existSong && title.trim() !== (existSong.title || '').trim()) {
            resolvedSlug = await generateUniqueSlug(Song, title);
        }

        if (!duration || duration <= 0) {
            return res.status(400).json(badRequest('Thời lượng phải lớn hơn 0'));
        }

        if (!artists || artists.length === 0) {
            return res.status(400).json(badRequest('Phải chọn ít nhất 1 nghệ sĩ'));
        }

        if (!genres || genres.length === 0) {
            return res.status(400).json(badRequest('Phải chọn ít nhất 1 thể loại'));
        }

        // Kiểm tra artists, genres, album tồn tại
        const artistDocs = await Artist.find({ _id: { $in: artists } });
        if (artistDocs.length !== artists.length) {
            return res.status(404).json(notFound('Một số nghệ sĩ không tồn tại'));
        }

        const genreDocs = await Genre.find({ _id: { $in: genres } });
        if (genreDocs.length !== genres.length) {
            return res.status(404).json(notFound('Một số thể loại không tồn tại'));
        }

        if (album_id) {
            const album = await Album.findById(album_id);
            if (!album) {
                return res.status(404).json(notFound('Album không tồn tại'));
            }
        }

        if (!existSong) {
            return res.status(404).json(notFound('Bài hát không tìm thấy'));
        }

        // Files from multer
        const files = req.files || {};
        const imageFile = files.image?.[0];
        const mediaFile = files.file_path?.[0];

        let updatedImageUrl = typeof image === 'string' ? image : (existSong.image || '');
        let updatedFileUrl = typeof file_path === 'string' ? file_path : (existSong.file_path || '');

        if (imageFile && imageFile.buffer) {
            const imageUrl = await uploadAnyBuffer(imageFile.buffer, 'zingmp5/files');
            updatedImageUrl = imageUrl || updatedImageUrl;
        }
        if (mediaFile && mediaFile.buffer) {
            const fileUrl = await uploadAnyBuffer(mediaFile.buffer, 'zingmp5/files');
            updatedFileUrl = fileUrl || updatedFileUrl;
        }

        const song = await Song.findByIdAndUpdate(
            id,
            {
                title,
                slug: resolvedSlug,
                duration,
                artists,
                genres,
                album_id: album_id || null,
                file_path: updatedFileUrl,
                image: updatedImageUrl,
                lyric: lyric || '',
                policy: policy || ''
            },
            { new: true, runValidators: true }
        ).populate('artists').populate('genres').populate('album_id');

        res.status(200).json(ok(song));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findByIdAndDelete(id);

        if (!song) {
            return res.status(404).json(notFound('Bài hát không tìm thấy'));
        }

        // Xóa song khỏi artists
        await Artist.updateMany(
            { _id: { $in: song.artists } },
            { $pull: { songs: id } }
        );

        // Xóa song khỏi album
        if (song.album_id) {
            await Album.findByIdAndUpdate(song.album_id, { $pull: { songs: id } });
        }

        res.status(200).json(ok("Bài hát đã được xóa thành công"));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy thống kê của bài hát
exports.getStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json(notFound('Bài hát không tìm thấy'));
        }

        const stats = {
            id: song._id,
            title: song.title,
            likes: song.likes,
            views: song.views,
            likedByCount: song.liked_by.length
        };

        res.status(200).json(ok(stats));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};
