const express = require("express")
const router = express.Router()
const artistController = require("../controller/artist.controller")
const authGuard = require("../middleware/auth.guard");
const permisionGuard = require("../middleware/permission.guard");
const {auth} = require("../controller/auth.controller");
const {ROLE} = require("../constants/role");

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Quản lý hồ sơ nghệ sĩ trên nền tảng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       properties:
 *         _id: { type: string, description: ID của nghệ sĩ }
 *         userId: { type: string, description: ID người dùng liên kết }
 *         stageName: { type: string, description: Nghệ danh }
 *         bio: { type: string, description: Tiểu sử nghệ sĩ }
 *         avatarUrl: { type: string, description: Ảnh đại diện }
 *         bannerUrl: { type: string, description: Ảnh bìa }
 *         location: { type: string, description: Nơi sinh sống / hoạt động }
 *         genreFocus:
 *           type: array
 *           items: { type: string }
 *           description: Danh sách ID thể loại
 *         socialLinks:
 *           type: object
 *           properties:
 *             youtube: { type: string }
 *             instagram: { type: string }
 *             facebook: { type: string }
 *             tiktok: { type: string }
 *         isVerified: { type: boolean, default: false }
 *         followerCount: { type: number, default: 0 }
 *         followingCount: { type: number, default: 0 }
 *       example:
 *         userId: "67234a3dfb8a9b2a11aa22dd"
 *         stageName: "LofiDreams"
 *         bio: "Producer chuyên về nhạc chill."
 *         location: "Đà Nẵng, Việt Nam"
 *         genreFocus: ["671ff63a52b2a6a1b99c440a"]
 */

/**
 * @swagger
 * /artists:
 *   post:
 *     summary: Tạo mới nghệ sĩ
 *     tags: [Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artist'
 *     responses:
 *       201:
 *         description: Nghệ sĩ được tạo thành công
 *         content:
 *           application/json:
 *             example:
 *               code: 201
 *               data:
 *                 _id: "67305a98e6f77b4123456789"
 *                 userId: "67234a3dfb8a9b2a11aa22dd"
 *                 stageName: "LofiDreams"
 *                 isVerified: false
 *                 followerCount: 0
 *               timestamp: "2025-10-30T12:00:00.000Z"
 *       400:
 *         description: User đã là nghệ sĩ hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/", authGuard, artistController.createArtist)

/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Lấy danh sách nghệ sĩ
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               data:
 *                 - _id: "67305a98e6f77b4123456789"
 *                   stageName: "LofiDreams"
 *                   genreFocus: [{ _id: "671ff63a52b2a6a1b99c440a", name: "Lofi" }]
 *                   followerCount: 15230
 *                   isVerified: true
 *               timestamp: "2025-10-30T12:00:00.000Z"
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", artistController.getAllArtists)

/**
 * @swagger
 * /artists/{id}:
 *   get:
 *     summary: Xem chi tiết nghệ sĩ
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: ID nghệ sĩ
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 */
router.get("/:id", artistController.getArtistById)

/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     summary: Cập nhật thông tin nghệ sĩ
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Artist' }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy nghệ sĩ
 */
router.put("/:id", authGuard, permisionGuard(ROLE.ARTIST), artistController.updateArtist)

module.exports = router
