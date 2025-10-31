const express = require("express")
const router = express.Router();
const genreController = require("../controller/genre.controller")
const authGuard = require("../middleware/auth.guard");
const permisionGuard = require("../middleware/permission.guard");

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Lấy tất cả danh sách thể loại
 *     tags: [Genre]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get('/', genreController.getGenres);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Tạo thể loại mới
 *     tags: [Genre]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - thumbnail
 *             properties:
 *               name:
 *                 type: string
 *                 example: name
 *               description:
 *                 type: string
 *                 example: description
 *               thumbnail:
 *                 type: string
 *                 example: https://acemusic.com.vn/wp-content/uploads/2023/03/ace-6-1.jpg
 *     responses:
 *       201:
 *         description: Tạo thể loại thành công.
 *       400:
 *         description: Thể loại này đã tồn tại.
 */
router.post('/create', authGuard, permisionGuard("ADMIN"), genreController.createGenre);

module.exports = router