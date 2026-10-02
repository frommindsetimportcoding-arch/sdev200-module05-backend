require("dotenv").config();

const mongoose = require("mongoose");
const dbUser = process.env.MONGO_USER;
const dbPassword = process.env.MONGO_PW;
const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@songdb.8sr72cq.mongodb.net/?appName=SongDB`;

mongoose
  .connect(dbURI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Database connection error: ", err));

module.exports = mongoose;
