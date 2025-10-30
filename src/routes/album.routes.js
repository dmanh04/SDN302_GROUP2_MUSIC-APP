const express = require("express")
const router = express.Router()
const albumController = require("../controller/album.controller")
const authGuard = require("../middleware/auth.guard");

// GET /albums - Lấy tất cả albums
router.get("/", albumController.findAll)

// POST /albums - Tạo mới album
router.post("/", authGuard ,albumController.create)

// GET /albums/:id - Lấy album theo ID
router.get("/:id", albumController.findOne)

// GET /albums/:id/songs - Lấy tất cả bài hát của album
router.get("/:id/songs", albumController.getAlbumSongs)

// PUT /albums/:id - Cập nhật album
router.put("/:id", authGuard ,albumController.update)

// DELETE /albums/:id - Xóa album
router.delete("/:id", authGuard ,albumController.delete)

module.exports = router
