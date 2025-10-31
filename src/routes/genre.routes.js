const express = require("express")
const router = express.Router();
const genreController = require("../controller/genre.controller")
const authGuard = require("../middleware/auth.guard");

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

module.exports = router