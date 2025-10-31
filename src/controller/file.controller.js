const { cloudinary } = require('../configs/cloudinary');
const { Readable } = require('stream');

// Upload any file buffer to Cloudinary (auto-detect resource type)
// Default folder: 'zingmp5/files'
const uploadAnyBuffer = (buffer, folder = 'zingmp5/files') =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result?.secure_url || '');
            }
        );
        Readable.from(buffer).pipe(stream);
    });

module.exports = { uploadAnyBuffer };


