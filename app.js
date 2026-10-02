// setup.. this is similar to when we use our default tags in html

const express = require("express");
// We have to use cors in order to host a front end and backend on the same device
var cors = require("cors");
// activate or tell this app variable to be an express server
const app = express();
const router = express.Router();

const Song = require("./models/songs");

app.use(cors());
app.use(express.json());

// grab all the songs in a database
router.get("/songs", async function (req, res) {
  let query = {};

  if (req.query.genre) {
    query = { genre: req.query.genre };
  }

  // to find all songs in a database you just use the find() method that is built into mongoose
  try {
    const songs = await Song.find(query);
    res.json(songs);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
    console.log(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);
app.listen(3000, () => {
  console.log("App is listening on port 3000");
});

// start the web server... app.listen(portNumber, function)

/*
app.listen(3000, function () {
  console.log("Listening on port 3000");
});
*/

// making an api using routes
// Routes are used to handle browser requests. They look like URLs. The difference is
// that when a browser requests a route, it is dynamically handled using a function.

// GET or a regular request when someone goes to http://localhost:3000/hello
// when using a function in a route, we almost always have a parameter or handle a response and request.
/*
app.get("/hello", function (req, res) {
  res.send("<h1>Hello Express</h1>");
});

app.get("/goodbye", function (req, res) {
  res.send("<h1>Goodbye, Express!</h1>");
});
*/

// Everything below was from the first week of this tutorial. This is without a database
// Creating an api on the backend that holds json objects.
// using the router to handle requests
// router.get("/songs", function (req, res) {
//   const songs = [
//     {
//       title: "Uptown Funk",
//       artist: "Bruno Mars",
//       popularity: 10,
//       genre: ["funk", "boogie"],
//     },
//     {
//       title: "We Found Love",
//       artist: "Rihanna",
//       popularity: 10,
//       releaseDate: new Date(2011, 9, 22),
//       genre: ["electro house"],
//     },
//     {
//       title: "Happy",
//       artist: "Pharrell Williams",
//       popularity: 10,
//       releaseDate: new Date(2013, 11, 21),
//       genre: ["soul", "new soul"],
//     },
//   ];

//   res.json(songs);
// });

// // all requests that usually use an api start with /api... so the url would be localhost:3000/api/songs
// app.use("/api", router);
// app.listen(3000);
