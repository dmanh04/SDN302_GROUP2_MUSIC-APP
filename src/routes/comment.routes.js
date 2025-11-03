const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment.controller");
const authGuard = require("../middleware/auth.guard");
const permissionGuard = require("../middleware/permission.guard");
const { ROLE } = require("../constants/role");

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Lấy danh sách comments
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: song_id
 *         schema:
 *           type: string
 *         description: Filter comments by song ID
 *     responses:
 *       200:
 *         description: Danh sách comments
 */
router.get("/", commentController.findAll);

/**
 * @swagger
 * /comments/{id}/replies:
 *   get:
 *     summary: Lấy danh sách replies của comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách replies
 */
router.get("/:id/replies", commentController.getReplies);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Lấy 1 comment theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết comment
 */
router.get("/:id", commentController.findOne);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Tạo comment mới (USER)
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - song_id
 *             properties:
 *               content:
 *                 type: string
 *               song_id:
 *                 type: string
 *               parent_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo comment thành công
 */
router.post(
    "/",
    authGuard,
    permissionGuard([ROLE.ADMIN, ROLE.USER, ROLE.ARTIST]),
    commentController.create
);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Cập nhật comment (ADMIN hoặc chính chủ)
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật comment thành công
 *       403:
 *         description: Không có quyền chỉnh sửa
 */
router.put(
    "/:id",
    authGuard,
    permissionGuard(ROLE.ADMIN, ROLE.USER, ROLE.ARTIST),
    commentController.update
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Xóa comment (ADMIN hoặc chính chủ)
 *     security:
 *       - bearerAuth: []
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa comment thành công
 *       403:
 *         description: Không có quyền xóa
 */
router.delete(
    "/:id",
    authGuard,
    permissionGuard(ROLE.ADMIN, ROLE.USER, ROLE.ARTIST),
    commentController.delete
);

module.exports = router;

