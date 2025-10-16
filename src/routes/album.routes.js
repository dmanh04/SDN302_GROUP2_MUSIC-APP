const express = require("express");
const router = express.Router();
const albumController = require("../controller/album.controller");

// Lấy tất cả Albums và Tạo mới Album
// GET /albums
router.get("/", albumController.findAll);
// POST /albums
router.post("/", albumController.create);

// Lấy, Cập nhật và Xóa Album theo ID
// GET /albums/:id
router.get("/:id", albumController.findOne);
// PUT /albums/:id
router.put("/:id", albumController.update);
// DELETE /albums/:id
router.delete("/:id", albumController.delete);

// Route tùy chỉnh: Lấy tất cả bài hát thuộc Album này
// GET /albums/:id/songs
router.get("/:id/songs", albumController.getAlbumSongs);

module.exports = router;