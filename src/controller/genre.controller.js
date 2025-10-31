const Genre = require('../models/genres.model');
const { ok, created, badRequest, notFound, internalError } = require('../utils/baseResponse');

exports.getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        if (genres.length === 0) {
            return res.status(404).json(notFound("Không tồn tại thể loại nào"));
        }
        const formattedGenre = genres.map((g) => ({
            _id: g._id,
            name: g.name,
            slug: g.slug,
            description: g.description,
            thumbnail: g.thumbnail,
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
            songs: g.songs
        }));
        res.status(200).json(ok(formattedGenre));
    } catch (error) {
        res.status(500).json(internalError(error.message));
    }
}

