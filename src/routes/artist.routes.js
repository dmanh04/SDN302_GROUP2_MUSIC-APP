const express = require("express")
const router = express.Router()
const artistController = require("../controller/artist.controller")

// GET /artists - Lấy tất cả artists
router.get("/", artistController.findAll)

// POST /artists - Tạo mới artist
router.post("/", artistController.create)

// GET /artists/:id - Lấy artist theo ID
router.get("/:id", artistController.findOne)

// PUT /artists/:id - Cập nhật artist
router.put("/:id", artistController.update)

// DELETE /artists/:id - Xóa artist
router.delete("/:id", artistController.delete)

module.exports = router
