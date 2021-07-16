const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { req, res } = req("express");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("bookings", (req, res) => {
  res.json(bookings)
});

app.get("/bookings/:id", (req, res) => {
  let bookingId = parseInt(req.params.id)

  if (bookings[bookingId]) res.json(bookings[bookingId])
  else {
    res.status(404)
    res.json({msg: `Could not find that booking with Id: ${bookingId}` })
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
