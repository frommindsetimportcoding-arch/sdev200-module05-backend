const db = require("../db");

// This will be important when creating our course objects
const Song = db.model("Song", {
  title: { type: String, required: true },
  artist: String,
  popularity: { type: Number, min: 1, max: 10 },
  releaseDate: { type: Date, default: Date.now },
  genre: [String],
});

module.exports = Song;
