const Album = require('../models/albums.model');
const slugify = require('slugify');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');
const { uploadAnyBuffer } = require('./file.controller');


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
    let { title, image, status, artist } = req.body;
    const userId = req.user.id;


    if (!artist && req.body['artist[]']) {
        artist = req.body['artist[]'];
    }

    if (artist) {
        if (typeof artist === 'string') {
            artist = [artist];
        } else if (Array.isArray(artist)) {
            artist = artist.map(a => String(a));
        } else {
            artist = [];
        }
    } else {
        artist = [];
    }

    if (!title || !artist || artist.length === 0) {
        return res.status(400).json(badRequest("Tiêu đề (title) và Nghệ sĩ (artist) là bắt buộc."));
    }

    try {
        const existingAlbum = await Album.findOne({ title });
        if (existingAlbum) {
            return res.status(400).json(badRequest("Album với tiêu đề này đã tồn tại."));
        }

        const files = req.files || {};
        const imageFile = files.image?.[0];

        let uploadedImageUrl = typeof image === 'string' ? image : '';

        if (imageFile && imageFile.buffer) {
            const imageUrl = await uploadAnyBuffer(imageFile.buffer, 'zingmp5/files');
            uploadedImageUrl = imageUrl || uploadedImageUrl;
        }

        const newAlbum = new Album({
            title,
            image: uploadedImageUrl,
            status: status || 'published',
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
    let updateData = { ...req.body };
    const userId = req.user.id;

    // Handle artist array from FormData
    // Multer parses artist[] as array, but if single value it might be string
    // Also check for artist[] key if multer didn't parse correctly
    if (!updateData.artist && req.body['artist[]']) {
        updateData.artist = req.body['artist[]'];
    }

    if (updateData.artist) {
        if (typeof updateData.artist === 'string') {
            updateData.artist = [updateData.artist];
        } else if (Array.isArray(updateData.artist)) {
            // Ensure all values are strings
            updateData.artist = updateData.artist.map(a => String(a));
        }
    }

    // Handle image file upload (similar to createAlbum)
    const files = req.files || {};
    const imageFile = files.image?.[0];

    if (imageFile && imageFile.buffer) {
        const imageUrl = await uploadAnyBuffer(imageFile.buffer, 'zingmp5/files');
        if (imageUrl) {
            updateData.image = imageUrl;
        }
    }

    // Remove image from body if it's a string and no new file is uploaded
    // We keep the existing image URL, so don't include it in updateData if it's just a string
    if (updateData.image && typeof updateData.image === 'string' && !imageFile) {
        // If it's a string URL and no new file, remove it from updateData
        // The existing image will remain unchanged
        delete updateData.image;
    }

    // Remove last_modified_by from count check
    const fieldsToCheck = { ...updateData };
    delete fieldsToCheck.last_modified_by;

    if (Object.keys(fieldsToCheck).length === 0) {
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