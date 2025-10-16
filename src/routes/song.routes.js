const express = require("express");
const router = express.Router();
const songController = require("../controller/song.controller");

// Lấy tất cả và Tạo mới Song
router.get("/", songController.findAll);
router.post("/", songController.create);

// Lấy, Cập nhật và Xóa Song theo ID
router.get("/:id", songController.findOne);
router.put("/:id", songController.update);
router.delete("/:id", songController.delete);

// Route tùy chỉnh: Lấy thống kê của bài hát
router.get("/:id/stats", songController.getStatistics);

module.exports = router;