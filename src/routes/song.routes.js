const express = require("express");
const router = express.Router();
const songController = require("../controller/song.controller");
const authGuard = require("../middleware/auth.guard");


router.get("/", songController.findAll);

// POST /songs - Tạo mới song
router.post("/", authGuard ,songController.create);

// GET /songs/:id - Lấy song theo ID
router.get("/:id", songController.findOne);

// PUT /songs/:id - Cập nhật song
router.put("/:id", authGuard ,songController.update);

// DELETE /songs/:id - Xóa song
router.delete("/:id", authGuard ,songController.delete);

// GET /songs/:id/stats - Lấy thống kê song
router.get("/:id/stats", songController.getStatistics);

module.exports = router;
