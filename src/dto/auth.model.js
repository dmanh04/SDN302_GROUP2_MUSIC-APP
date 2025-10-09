/**
 * ===========================================
 * 🧭 AUTH MODULE - API DOCUMENTATION (DTO)
 * ===========================================
 * Base URL: /api/auth
 * Mô tả: Xử lý các nghiệp vụ xác thực người dùng (đăng ký, đăng nhập)
 * -------------------------------------------
 * Author: SDN302 Group 2
 * Version: 1.0.0
 * ===========================================
 */

/**
 * @api {post} /api/auth/sign-in Đăng nhập tài khoản
 */

/**
 * @typedef {Object} AuthLoginRequest
 * @property {string} email - Email người dùng
 * @property {string} password - Mật khẩu đăng nhập
 * @property {string} retypePassword - Mật khẩu đăng nhập
 */

/**
  * @apiSuccessExample {json} Response 200 - Thành công:
 * {
 *   "code": 200,
 *   "data": {
 *     "id": "6712b9e43f4f5ef4ce4f1b11",
 *     "username": "manh",
 *     "email": "manh@example.com",
 *     "token": "eyJhbGciOiJIUzI1..."
 *   },
 *   "timestamp": "2025-10-09T16:21:00.000Z"
 * }
 *
 * @apiErrorExample {json} Response 400 - Email hoặc mật khẩu sai:
 * {
 *   "code": 400,
 *   "errors": ["Email hoặc mật khẩu không đúng"],
 *   "timestamp": "2025-10-09T16:22:00.000Z"
 * }
 */

