const Artist = require('../models/artists.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');

// Tạo mới Artist
exports.create = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json(badRequest('Tên nghệ sĩ không được để trống'));
        }

        const artist = new Artist({ 
            name, 
            bio: bio || '', 
            avatar: avatar || '',
            albums: [],
            songs: []
        });
        await artist.save();
        
        res.status(201).json(created(artist));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy tất cả Artists
exports.findAll = async (req, res) => {
    try {
        const artists = await Artist.find({})
            .populate('albums')
            .populate('songs');
        res.status(200).json(ok(artists));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Lấy Artist theo ID
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findById(id)
            .populate('albums')
            .populate('songs');
        
        if (!artist) {
            return res.status(404).json(notFound('Nghệ sĩ không tìm thấy'));
        }
        
        res.status(200).json(ok(artist));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Cập nhật Artist theo ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio, avatar } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json(badRequest('Tên nghệ sĩ không được để trống'));
        }

        const artist = await Artist.findByIdAndUpdate(
            id, 
            { name, bio: bio || '', avatar: avatar || '' }, 
            { new: true, runValidators: true }
        ).populate('albums').populate('songs');
        
        if (!artist) {
            return res.status(404).json(notFound('Nghệ sĩ không tìm thấy'));
        }
        
        res.status(200).json(ok(artist));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};

// Xóa Artist theo ID
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByIdAndDelete(id);
        
        if (!artist) {
            return res.status(404).json(notFound('Nghệ sĩ không tìm thấy'));
        }
        
        res.status(200).json(ok(null));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
};
