const express = require("express");
const router = express.Router();

const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
//New routes
const roleRouter = require('./role.routes');
const artistRouter = require('./artist.routes');
const genreRouter = require('./genre.routes');
const albumRouter = require('./album.routes');
const songRouter = require('./song.routes');
const commentRouter = require('./comment.routes');
const relationshipRouter = require('./relationship.routes');
// API routes
router.use("/auth", authRouter);
router.use("/users", userRouter);

//New API routes
router.use("/roles", roleRouter);
router.use("/artists", artistRouter);
router.use("/genres", genreRouter);
router.use("/albums", albumRouter);
router.use("/songs", songRouter);
router.use("/comments", commentRouter);
// API for many-to-many relationships and tokens
router.use("/relationships", relationshipRouter);

module.exports = router;
