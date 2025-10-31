const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dff989w82',
    api_key: process.env.CLOUDINARY_API_KEY || '351746993553398',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'HMVrgoBJVBZsLpVDa3xQ_qTZ_cY'
});

module.exports = { cloudinary };


