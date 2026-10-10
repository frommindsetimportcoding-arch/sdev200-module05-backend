// setup.. this is similar to when we use our default tags in html

const express = require("express");
// We have to use cors in order to host a front end and backend on the same device
var cors = require("cors");
const jwt = require("jwt-simple");
const secret = "supersecret";
// activate or tell this app variable to be an express server
const app = express();
const router = express.Router();

const Song = require("./models/songs");
const User = require("./models/users");

app.use(cors());
app.use(express.json());

// Creating a new user
router.post("/user", async function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: "Missing username or password" });
  }

  const newUser = await new User({
    username: req.body.username,
    password: req.body.password,
    status: req.body.status,
  });
  try {
    await newUser.save();
    res.sendStatus(201); // created
  } catch (err) {
    res.status(400).send(err);
  }
});

// Authenticate or login
// Is a POST request - reason why is because when you login you are creating what is called a new 'session'.
router.post("/auth", async function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }
  // Try to find the username in the database, then see if it matches with a username and password.
  let user = await User.findOne({ username: req.body.username });
  // Connection or server error

  if (!user) {
    res.status(401).json({ error: "Bad username" });
    return;
  } else {
    if (user.password != req.body.password) {
      res.status(401).json({ error: "Bad Password" });
      return;
    }
    // Successful login.
    else {
      // Create a token that is encoded with the jwt library, and send back the username... This will be important later.
      // We also will send back as part of the token that you are currently authorized.
      // We could do this with a boolean or a number value e.g. if auth = 0 you are not authorized, if auth = 1 you are authorized.

      username2 = user.username;
      const token = jwt.encode({ username: user.username }, secret);
      const auth = 1;

      // respond with the token.
      res.json({
        username2,
        token: token,
        auth: auth,
      });
    }
  }
});

// Check status of user with a valid token, see if it matches the front end token.
router.get("/status", async function (req, res) {
  if (!req.headers["x-auth"]) {
    return res.status(401).json({ error: "Missing x-auth" });
  }
  // if x-auth contains the token (it should)
  const token = req.headers["x-auth"];
  try {
    // Not noted in video but we don't actually use the decoded variable. jwt-simple both decodes and authenticates
    // using jwt.decode.
    const decoded = jwt.decode(token, secret);

    // send back all username and status fields to the user or front end
    let users = await User.find({}, "username status");
    res.json(users);
  } catch (ex) {
    res.status(401).json({ error: "invalid jwt" });
  }
});

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

router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

// update is to update an existing record/resource/database entry.. it uses a PUT request
// You actually do need the full api path "/songs/:id" to handle the PUT operation.
// There's a chance that there may be some short cut that was not uncovered during the tutorial
// But the safest options is to include the full path.
router.put("/songs/:id", async (req, res) => {
  // first we need to find and update the song the front end wants us to update.
  // to do this we need to request the id of the song from the request
  // and then find it in the database and update it.
  try {
    const song = req.body;
    await Song.updateOne({ _id: req.params.id }, song);
    console.log(song);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE  a song by using a .delete request. We're going to set the const to deletedSong to clarify intent.
// we use the method .findByIdAndDelete(req.params.id);
// the redirect will be handled on the front end

router.delete("/songs/:id", async function (req, res) {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);

    // We will check for the existence of the deleted song object and return a unique response dependent on the boolean returned.
    if (!deletedSong) {
      return res.status(404).send("Song not found.");
    }

    // If you make it this far than the song was deleted and the object was stored in deletedSong
    res.json({ message: "Song succesfully deleted", song: deletedSong });
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
