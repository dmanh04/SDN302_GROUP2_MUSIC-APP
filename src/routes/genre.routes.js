const express = require("express");
const router = express.Router();
const genreController = require("../controller/genre.controller");

// Lấy tất cả Genres và Tạo mới Genre
// GET /genres
router.get("/", genreController.findAll);
// POST /genres
router.post("/", genreController.create);

// Lấy, Cập nhật và Xóa Genre theo ID
// GET /genres/:id
router.get("/:id", genreController.findOne);
// PUT /genres/:id
router.put("/:id", genreController.update);
// DELETE /genres/:id
router.delete("/:id", genreController.delete);

module.exports = router;