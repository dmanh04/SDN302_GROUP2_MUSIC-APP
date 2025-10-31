const express = require("express")
const router = express.Router()

const genreRouter = require("./genre.routes")
const artistRouter = require("./artist.routes")
const albumRouter = require("./album.routes")
const songRouter = require("./song.routes")
const authRouter = require("./auth.routes")

// API routes
router.use("/genres", genreRouter)
router.use("/artists", artistRouter)
router.use("/albums", albumRouter)
router.use("/songs", songRouter)
router.use("/auth", authRouter)

module.exports = router
