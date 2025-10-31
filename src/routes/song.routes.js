const express = require("express");
const router = express.Router();
const songController = require("../controller/song.controller");
const authGuard = require("../middleware/auth.guard");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get("/", songController.findAll);

router.post(
  "/",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  authGuard, songController.create
);

router.get("/:id", songController.findOne);

router.put(
  "/:id",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  authGuard, songController.update
);

// DELETE /songs/:id - Xóa song
router.delete("/:id", authGuard, songController.delete);

// GET /songs/:id/stats - Lấy thống kê song
router.get("/:id/stats", songController.getStatistics);

module.exports = router;
