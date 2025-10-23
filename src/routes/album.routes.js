const express = require("express")
const router = express.Router()
const albumController = require("../controller/album.controller")

// GET /albums - Lấy tất cả albums
router.get("/", albumController.findAll)

// POST /albums - Tạo mới album
router.post("/", albumController.create)

// GET /albums/:id - Lấy album theo ID
router.get("/:id", albumController.findOne)

// GET /albums/:id/songs - Lấy tất cả bài hát của album
router.get("/:id/songs", albumController.getAlbumSongs)

// PUT /albums/:id - Cập nhật album
router.put("/:id", albumController.update)

// DELETE /albums/:id - Xóa album
router.delete("/:id", albumController.delete)

module.exports = router
