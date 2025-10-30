const express = require("express")
const router = express.Router()
const genreController = require("../controller/genre.controller")
const authGuard = require("../middleware/auth.guard");

// GET /genres - Lấy tất cả genres
router.get("/", genreController.findAll)

// POST /genres - Tạo mới genre
router.post("/", authGuard, genreController.create)

// GET /genres/:id - Lấy genre theo ID
router.get("/:id", genreController.findOne)

// PUT /genres/:id - Cập nhật genre
router.put("/:id", authGuard, genreController.update)

// DELETE /genres/:id - Xóa genre
router.delete("/:id", authGuard, genreController.delete)

module.exports = router
