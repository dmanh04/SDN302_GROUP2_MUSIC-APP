const express = require("express")
const router = express.Router()
const authController = require("../controller/auth.controller")

/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: Đăng nhập tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Email đã tồn tại
 */
router.post("/sign-in", authController.auth)


/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Email đã tồn tại
 */
router.post("/sign-up", authController.signUp)

module.exports = router