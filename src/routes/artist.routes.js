const express = require("express")
const router = express.Router()
const artistController = require("../controller/artist.controller")
const authGuard = require("../middleware/auth.guard");

// GET /artists - Lấy tất cả artists
router.get("/", artistController.findAll)

// POST /artists - Tạo mới artist
router.post("/", authGuard ,artistController.create)

// GET /artists/:id - Lấy artist theo ID
router.get("/:id", artistController.findOne)

// PUT /artists/:id - Cập nhật artist
router.put("/:id", authGuard ,artistController.update)

// DELETE /artists/:id - Xóa artist
router.delete("/:id", authGuard ,artistController.delete)

module.exports = router
