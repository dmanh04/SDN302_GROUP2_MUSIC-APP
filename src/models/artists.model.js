const mongoose = require("mongoose")

const ArtistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true,
    },
    stageName: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    genreFocus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],

    socialLinks: {
      instagram: String,
      youtube: String,
      facebook: String,
      tiktok: String,
    },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Artist", ArtistSchema)
