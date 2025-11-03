const express = require("express");
const router = express.Router();
const songController = require("../controller/song.controller");
const authGuard = require("../middleware/auth.guard");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const permisionGuard = require("../middleware/permission.guard");
const { ROLE } = require("../constants/role");
/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Lấy danh sách bài hát
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: Danh sách bài hát
 */
router.get("/", songController.findAll);

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Tạo bài hát mới (ADMIN/ARTIST)
 *     description: Có thể gửi multipart/form-data (image, file_path) hoặc JSON URL. Yêu cầu Bearer token.
 *     security:
 *       - bearerAuth: []
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: number
 *               artists[]:
 *                 type: array
 *                 items:
 *                   type: string
 *               genres[]:
 *                 type: array
 *                 items:
 *                   type: string
 *               album_id:
 *                 type: string
 *                 nullable: true
 *               lyric:
 *                 type: string
 *               policy:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               file_path:
 *                 type: string
 *                 format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               duration:
 *                 type: number
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               album_id:
 *                 type: string
 *                 nullable: true
 *               lyric:
 *                 type: string
 *               policy:
 *                 type: string
 *               image:
 *                 type: string
 *               file_path:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post(
  "/",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  authGuard, permisionGuard([ROLE.ADMIN, ROLE.ARTIST]), songController.create
);

/**
 * @swagger
 * /songs/{id}:
 *   get:
 *     summary: Lấy chi tiết bài hát (tăng views)
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết bài hát
 */
router.get("/:id", songController.findOne);

/**
 * @swagger
 * /songs/{id}:
 *   put:
 *     summary: Cập nhật bài hát (ADMIN/ARTIST)
 *     description: Có thể gửi multipart để thay ảnh/audio hoặc JSON để cập nhật metadata. Yêu cầu Bearer token.
 *     security:
 *       - bearerAuth: []
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  "/:id",
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file_path', maxCount: 1 },
  ]),
  authGuard,
  permisionGuard([ROLE.ADMIN, ROLE.ARTIST]),
  songController.update
);

/**
 * @swagger
 * /songs/{id}:
 *   delete:
 *     summary: Xóa bài hát (ADMIN/ARTIST)
 *     security:
 *       - bearerAuth: []
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", authGuard, permisionGuard([ROLE.ADMIN, ROLE.ARTIST]), songController.delete);

/**
 * @swagger
 * /songs/{id}/stats:
 *   get:
 *     summary: Lấy thống kê bài hát
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get("/:id/stats", songController.getStatistics);

module.exports = router;
