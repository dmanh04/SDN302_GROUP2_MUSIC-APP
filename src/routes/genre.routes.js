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
 * /genres/create:
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

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Xóa thể loại nhạc theo ID
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: ObjectId
 *         required: true
 *         description: "ID của thể loại cần xóa (Ví dụ: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy thể loại để xóa
 */
router.delete('/:id', authGuard, permisionGuard("ADMIN"), genreController.deleteGenre);

module.exports = router