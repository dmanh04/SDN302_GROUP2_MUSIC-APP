const express = require("express");
const router = express.Router();
const accountController = require("../controller/accountManagement.controller");
const authGuard = require("../middleware/auth.guard");
const permissionGuard = require("../middleware/permission.guard");
const { ROLE } = require("../constants/role");

// chỉ ADMIN có quyền truy cập toàn bộ tài khoản
router.get("/", authGuard, accountController.getAll);
router.get("/:id", authGuard, accountController.getById);
router.post("/", authGuard, accountController.create);
router.put("/:id", authGuard, accountController.update);
router.delete("/:id", authGuard, accountController.remove);

module.exports = router;
