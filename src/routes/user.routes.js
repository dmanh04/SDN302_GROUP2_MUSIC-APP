const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

router.get("/current", userController.getCurrentUser);

router.put("/update-profile", userController.updateProfile);

module.exports = router;