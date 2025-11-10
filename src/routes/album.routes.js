const express = require("express");
const router = express.Router();
const albumController = require("../controller/album.controller");
const authGuard = require("../middleware/auth.guard");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const permisionGuard = require("../middleware/permission.guard");
const { ROLE } = require("../constants/role");

/**
 * @swagger
 * tags:
 *   name: Album
 *   description: API quản lý album nhạc
 */

/**
 * @swagger
 * /albums:
 *   get:
 *     summary: Lấy danh sách tất cả album
 *     tags: [Album]
 *     responses:
 *       200:
 *         description: Lấy danh sách album thành công
 */
router.get("/", albumController.getAlbums);

/**
 * @swagger
 * /albums/create:
 *   post:
 *     summary: Tạo mới một album
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - image
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: Album Mới Nhất
 *               artist:
 *                 type: string
 *                 example: Sơn Tùng M-TP
 *               status:
 *                 type: string
 *                 example: "published"
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/album.jpg"
 *     responses:
 *       201:
 *         description: Tạo album thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc album đã tồn tại
 */
router.post(
    "/create",
    upload.fields([
        { name: 'image', maxCount: 1 },
    ]),
    authGuard,
    permisionGuard(ROLE.ADMIN, ROLE.ARTIST),
    albumController.createAlbum
);

/**
 * @swagger
 * /albums/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của album theo ID
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của album cần lấy (Ví dụ: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *     responses:
 *       200:
 *         description: Lấy thông tin album thành công
 *       404:
 *         description: Không tìm thấy album
 */
router.get("/:id", albumController.findOneAlbum);

/**
 * @swagger
 * /albums/{id}/songs:
 *   get:
 *     summary: Lấy danh sách bài hát trong một album
 *     tags: [Album]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của album cần lấy bài hát (Ví dụ: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *     responses:
 *       200:
 *         description: Lấy danh sách bài hát thành công
 *       404:
 *         description: Không tìm thấy album hoặc bài hát
 */
router.get("/:id/songs", albumController.getAlbumSongs);

/**
 * @swagger
 * /albums/{id}:
 *   put:
 *     summary: Cập nhật thông tin album theo ID
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của album cần cập nhật (Ví dụ: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - image
 *               - status
 *               - songs
 *             properties:
 *               title:
 *                 type: string
 *                 example: Album Mới Nhất
 *               artist:
 *                 type: string
 *                 example: Sơn Tùng M-TP
 *               status:
 *                 type: string
 *                 example: "published"
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/album.jpg"
 *               songs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 example:
 *                   - "6904d247f94cd8e21b9b68ed"
 *                   - "6904d247f94cd8e21b9b68ee"
 *     responses:
 *       200:
 *         description: Cập nhật album thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy album để cập nhật
 */
router.put(
    "/:id",
    upload.fields([
        { name: 'image', maxCount: 1 },
    ]),
    authGuard,
    permisionGuard(ROLE.ADMIN, ROLE.ARTIST),
    albumController.updateAlbum
);

/**
 * @swagger
 * /albums/{id}:
 *   delete:
 *     summary: Xóa album theo ID
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của album cần xóa (Ví dụ: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *     responses:
 *       204:
 *         description: Xóa album thành công
 *       404:
 *         description: Không tìm thấy album để xóa
 */
router.delete("/:id", authGuard, albumController.deleteAlbum);

/**
 * @swagger
 * /albums/{albumId}/songs/{songId}:
 *   delete:
 *     summary: Xóa một bài hát khỏi album
 *     description: Loại bỏ bài hát có ID cụ thể khỏi album tương ứng. Chỉ người dùng đã xác thực mới được phép thực hiện.
 *     tags: [Album]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của album chứa bài hát cần xóa (VD: 65b4c4e7f8d6a7b9c0e1d2c3)"
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: "ID của bài hát cần xóa khỏi album (VD: 65b4c4e7f8d6a7b9c0e1d2c4)"
 *     responses:
 *       200:
 *         description: Xóa bài hát khỏi album thành công
 *       400:
 *         description: ID album hoặc bài hát không hợp lệ
 *       401:
 *         description: Không có quyền truy cập (thiếu hoặc token không hợp lệ)
 *       404:
 *         description: Không tìm thấy album tương ứng
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete("/:albumId/songs/:songId", authGuard, albumController.removeSongFromAlbum);

module.exports = router;