const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");


app.get("/",  (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});


//Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
