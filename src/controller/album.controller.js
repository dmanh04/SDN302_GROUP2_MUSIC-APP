const Album = require('../models/albums.model');
const Artist = require('../models/artists.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');

// Tạo mới Album
exports.create = async (req, res) => {
    try {
        const { title, slug, artists_id, image, status } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json(badRequest('Tên album không được để trống'));
        }
        
        if (!slug || slug.trim() === '') {
            return res.status(400).json(badRequest('Slug không được để trống'));
        }
        
        if (!artists_id) {
            return res.status(400).json(badRequest('Nghệ sĩ không được để trống'));
        }

        // Kiểm tra artist tồn tại
        const artist = await Artist.findById(artists_id);
        if (!artist) {
            return res.status(404).json(notFound('Nghệ sĩ không tìm thấy'));
        }

        const album = new Album({ 
            title, 
            slug,
            artists_id,
            image: image || '',
            status: status || 'active',
            songs: [],
            created_by: req.user?.id || 'system'
        });
        
        await album.save(); 
        
        
        // Thêm album vào danh sách của artist
        artist.albums.push(album._id);
        await artist.save();
        
        res.status(201).json(created(album));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy tất cả Albums
exports.findAll = async (req, res) => {
    try {
        const albums = await Album.find({})
            .populate('artists_id')
            .populate('songs');
        res.status(200).json(ok(albums));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy Album theo ID
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await Album.findById(id)
            .populate('artists_id')
            .populate({
                path: 'songs',
                populate: ['artists', 'genres']
            });
        
        if (!album) {
            return res.status(404).json(notFound('Album không tìm thấy'));
        }
        
        res.status(200).json(ok(album));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Cập nhật Album theo ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, status, image } = req.body;
        
        if (!title || title.trim() === '') {
            return res.status(400).json(badRequest('Tên album không được để trống'));
        }

        const album = await Album.findByIdAndUpdate(
            id, 
            { title, slug: slug || '', status: status || 'active', image: image || '' }, 
            { new: true, runValidators: true }
        ).populate('artists_id').populate('songs');
        
        if (!album) {
            return res.status(404).json(notFound('Album không tìm thấy'));
        }
        
        res.status(200).json(ok(album));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Xóa Album theo ID
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await Album.findByIdAndDelete(id);
        
        if (!album) {
            return res.status(404).json(notFound('Album không tìm thấy'));
        }
        
        // Xóa album khỏi artist
        await Artist.findByIdAndUpdate(album.artists_id, { $pull: { albums: id } });
        
        res.status(200).json(ok(null));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy tất cả bài hát thuộc Album này
exports.getAlbumSongs = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await Album.findById(id).populate({
            path: 'songs',
            populate: ['artists', 'genres']
        });
        
        if (!album) {
            return res.status(404).json(notFound('Album không tìm thấy'));
        }
        
        res.status(200).json(ok(album.songs));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};
