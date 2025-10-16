const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment.controller");

// Lấy tất cả Comments và Tạo mới Comment
// GET /comments (Thường kèm theo query param song_id)
router.get("/", commentController.findAll);
// POST /comments
router.post("/", commentController.create);

// Lấy, Cập nhật và Xóa Comment theo ID
// GET /comments/:id
router.get("/:id", commentController.findOne);
// PUT /comments/:id
router.put("/:id", commentController.update);
// DELETE /comments/:id
router.delete("/:id", commentController.delete);

// Route tùy chỉnh: Lấy tất cả comments của một bài hát cụ thể
// GET /songs/:songId/comments
router.get("/songs/:songId/comments", commentController.findCommentsBySong);

module.exports = router;