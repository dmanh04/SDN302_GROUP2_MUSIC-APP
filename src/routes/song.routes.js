const express = require("express");
const router = express.Router();
const songController = require("../controller/song.controller");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get("/", songController.findAll);

// POST /songs - Tạo mới song (with memory upload for image & file)
router.post(
  "/",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  songController.create
);

// GET /songs/:id - Lấy song theo ID
router.get("/:id", songController.findOne);

// PUT /songs/:id - Cập nhật song (optionally replace image/file)
router.put(
  "/:id",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  songController.update
);

// DELETE /songs/:id - Xóa song
router.delete("/:id", songController.delete);

// GET /songs/:id/stats - Lấy thống kê song
router.get("/:id/stats", songController.getStatistics);

module.exports = router;
