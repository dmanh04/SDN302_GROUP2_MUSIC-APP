const express = require("express");
const router = express.Router();
const relationController = require("../controller/relation.controller");

// --- Song Likes ---
// POST: Like một bài hát
router.post("/likes", relationController.likeSong);
// DELETE: Bỏ like một bài hát (song_id, account_id)
router.delete("/likes", relationController.unlikeSong);
// GET: Lấy danh sách bài hát đã thích của một người dùng
router.get("/accounts/:accountId/likes", relationController.getAccountLikes);

// --- Account Roles ---
// POST: Gán Role cho Account
router.post("/account-roles", relationController.assignRole);
// DELETE: Gỡ Role khỏi Account
router.delete("/account-roles", relationController.unassignRole);

// --- Song Genres ---
// POST: Gán Genre cho Song
router.post("/song-genres", relationController.addSongGenre);
// DELETE: Gỡ Genre khỏi Song
router.delete("/song-genres", relationController.removeSongGenre);

// --- Song Artists ---
// POST: Thêm Artist vào Song
router.post("/song-artists", relationController.addSongArtist);
// DELETE: Xóa Artist khỏi Song
router.delete("/song-artists", relationController.removeSongArtist);


// --- Refresh Tokens (Thường được xử lý trong Auth Controller, nhưng nếu cần CRUD riêng) ---
// Thường không cần CRUD công khai; được xử lý nội bộ trong `auth.controller`
// router.delete("/refresh-tokens/:id", relationController.revokeToken);

module.exports = router;