const express = require("express");
const router = express.Router();
const artistController = require("../controller/artist.controller");

// Lấy tất cả Artists và Tạo mới Artist
// GET /artists
router.get("/", artistController.findAll);
// POST /artists
router.post("/", artistController.create);

// Lấy, Cập nhật và Xóa Artist theo ID
// GET /artists/:id
router.get("/:id", artistController.findOne);
// PUT /artists/:id
router.put("/:id", artistController.update);
// DELETE /artists/:id
router.delete("/:id", artistController.delete);

module.exports = router;