const Album = require('../models/albums.model');
const slugify = require('slugify');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');


exports.getAlbums = async (req, res) => {
    try {
        const albums = await Album.find().populate('artist', 'stageName');

        if (albums.length === 0) {
            return res.status(404).json(notFound("Không tìm thấy album nào"));
        }

        res.status(200).json(ok(albums.map(a => a.toObject())));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách album:', error);
        res.status(500).json(internalError(error.message));
    }
};

exports.createAlbum = async (req, res) => {
    const { title, image, status, artist } = req.body;
    const userId = req.user.id;

    if (!title || !artist || artist.length === 0) {
        return res.status(400).json(badRequest("Tiêu đề (title) và Nghệ sĩ (artist) là bắt buộc."));
    }

    try {
        const existingAlbum = await Album.findOne({ title });
        if (existingAlbum) {
            return res.status(400).json(badRequest("Album với tiêu đề này đã tồn tại."));
        }

        const newAlbum = new Album({
            title,
            image,
            status,
            artist,
            created_by: userId
        });

        await newAlbum.save();
        res.status(201).json(created(newAlbum.toObject(), "Tạo album thành công."));
    } catch (error) {
        console.error('Lỗi khi tạo album:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json(badRequest(error.message));
        }

        res.status(500).json(internalError(error.message));
    }
};

exports.updateAlbum = async (req, res) => {
    const { id } = req.params;
    let updateData = req.body;
    const userId = req.user.id;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json(badRequest("Vui lòng cung cấp ít nhất 1 trường để cập nhật."));
    }

    updateData.last_modified_by = userId;

    try {
        let updatedAlbum = await Album.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('artist', 'stageName');

        if (!updatedAlbum) {
            return res.status(404).json(notFound("Không tìm thấy album để cập nhật."));
        }

        if (updateData.title) {
            const newSlug = slugify(updateData.title, { lower: true, strict: true });
            updatedAlbum.slug = newSlug;
            updatedAlbum.last_modified_by = userId;
            await updatedAlbum.save();
        }

        res.status(200).json(ok(updatedAlbum.toObject(), "Cập nhật album thành công."));
    } catch (error) {
        console.error('Lỗi khi cập nhật album:', error);

        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json(badRequest("Dữ liệu cập nhật không hợp lệ (tiêu đề có thể bị trùng)."));
        }

        res.status(500).json(internalError(error.message));
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findByIdAndDelete(id);

        if (!album) {
            return res.status(404).json(notFound("Không tìm thấy album để xóa."));
        }

        res.status(204).end();
    } catch (error) {
        console.error('Lỗi khi xóa album:', error);
        res.status(500).json(internalError(error.message));
    }
};

exports.findOneAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findById(id)
            .populate('artist', 'stageName') // Chỉ lấy stageName và _id của Artist
            .populate('songs', 'title'); //tham số đầu tiên phải trùng với tên trường của albumSchema

        if (!album) {
            return res.status(404).json(notFound(`Không tìm thấy Album với ID: ${id}`));
        }

        res.status(200).json(ok(album.toObject()));
    } catch (error) {
        console.error('Lỗi khi tìm kiếm Album theo ID:', error);
        res.status(500).json(internalError(error.message));
    }
};

exports.getAlbumSongs = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await Album.findById(id)
            .populate('songs', 'title');

        if (!album) {
            return res.status(404).json(notFound(`Không tìm thấy Album với ID: ${id}`));
        }

        if (!album.songs || album.songs.length === 0) {
            return res.status(200).json(ok([], `Album "${album.title}" chưa có bài hát nào.`));
        }

        res.status(200).json(ok(album.songs.map(s => s.toObject())));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài hát của Album:', error);
        res.status(500).json(internalError(error.message));
    }
};

exports.removeSongFromAlbum = async (req, res) => {
    const { albumId, songId } = req.params;
    const userId = req.user.id;

    try {
        const updatedAlbum = await Album.findByIdAndUpdate(
            albumId,
            {
                // Sử dụng toán tử $pull để loại bỏ ObjectId cụ thể khỏi mảng songs
                $pull: { songs: songId },
                last_modified_by: userId
            },
            {
                new: true // Trả về document sau khi cập nhật
            }
        ).populate('artist', 'stageName');
        
        if (!updatedAlbum) {
            return res.status(404).json(notFound(`Không tìm thấy Album với ID: ${albumId}`));
        }

        res.status(200).json(ok(updatedAlbum.toObject(), `Đã xóa bài hát ${songId} khỏi Album thành công.`));
    } catch (error) {
        console.error(`Lỗi khi xóa bài hát ${songId} khỏi Album ${albumId}:`, error);
        
        if (error.name === 'CastError') {
             return res.status(400).json(badRequest("ID Album hoặc ID Bài hát không hợp lệ."));
        }
        
        res.status(500).json(internalError(error.message));
    }
};