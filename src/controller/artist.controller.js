const Artist = require("../models/artists.model")
const Genre = require("../models/genres.model")
const {
  ok,
  created,
  badRequest,
  notFound,
  internalError,
} = require("../utils/baseResponse")

exports.createArtist = async (req, res) => {
  try {
    const {
      userId,
      stageName,
      bio,
      location,
      genreFocus,
      socialLinks,
    } = req.body
    const existing = await Artist.findOne({ userId })
    if (existing)
      return res
        .status(400)
        .json(badRequest("Tài khoản này đã được đăng ký làm nghệ sĩ."))
    if (genreFocus?.length) {
      const validGenres = await Genre.find({ _id: { $in: genreFocus } })
      if (validGenres.length !== genreFocus.length)
        return res
          .status(400)
          .json(badRequest("Một hoặc nhiều thể loại không hợp lệ."))
    }
    const artist = await Artist.create({
      userId,
      stageName,
      bio,
      location,
      genreFocus,
      socialLinks,
    })

    return res.status(201).json(created(artist))
  } catch (err) {
    console.error("❌ Lỗi khi tạo nghệ sĩ:", err)
    return res.status(500).json(internalError(err.message))
  }
}

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find()
      .populate("genreFocus", "name")
      .populate("songs", "title coverUrl")
      .populate("albums", "title coverUrl releaseDate")
      .populate("userId")
      .sort({ createdAt: -1 })

    return res.status(200).json(ok(artists))
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách nghệ sĩ:", err)
    return res.status(500).json(internalError(err.message))
  }
}

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate("genreFocus", "name description")
      .populate("songs", "title")
      .populate("albums", "title")

    if (!artist)
      return res.status(404).json(notFound("Không tìm thấy nghệ sĩ."))

    return res.status(200).json(ok(artist))
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin nghệ sĩ:", err)
    return res.status(500).json(internalError(err.message))
  }
}

exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const artist = await Artist.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("genreFocus", "name")

    if (!artist) return res.status(404).json(notFound("Nghệ sĩ không tồn tại."))

    return res.status(200).json(ok(artist))
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật nghệ sĩ:", err)
    return res.status(500).json(internalError(err.message))
  }
}

exports.getArtistByUserId = async (req, res) => {
  try {
    const { userId } = req.params

    const artist = await Artist.findOne({ userId })
      .populate("genreFocus", "name description")
      .populate("songs", "title")
      .populate("albums", "title")
      .populate("userId")

    if (!artist) {
      return res.status(404).json(notFound("Không tìm thấy nghệ sĩ với userId này."))
    }

    return res.status(200).json(ok(artist))
  } catch (err) {
    console.error("❌ Lỗi khi lấy nghệ sĩ theo userId:", err)
    return res.status(500).json(internalError(err.message))
  }
}