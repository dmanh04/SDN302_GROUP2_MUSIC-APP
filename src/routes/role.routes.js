const express = require("express");
const router = express.Router();
const roleController = require("../controller/role.controller");

// Lấy tất cả và Tạo mới Role
router.get("/", roleController.findAll);
router.post("/", roleController.create);

// Lấy, Cập nhật và Xóa Role theo ID
router.get("/:id", roleController.findOne);
router.put("/:id", roleController.update);
router.delete("/:id", roleController.delete);

module.exports = router;