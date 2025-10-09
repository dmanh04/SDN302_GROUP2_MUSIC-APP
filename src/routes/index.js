

const express = require("express");
const router = express.Router();

const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');

// API routes
router.use("/auth", authRouter);
router.use("/users", userRouter);


module.exports = router;
