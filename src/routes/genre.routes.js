const express = require("express")
const router = express.Router()
const genreController = require("../controller/genre.controller")

// GET /genres - Lấy tất cả genres
router.get("/", genreController.findAll)

// POST /genres - Tạo mới genre
router.post("/", genreController.create)

// GET /genres/:id - Lấy genre theo ID
router.get("/:id", genreController.findOne)

// PUT /genres/:id - Cập nhật genre
router.put("/:id", genreController.update)

// DELETE /genres/:id - Xóa genre
router.delete("/:id", genreController.delete)

module.exports = router
