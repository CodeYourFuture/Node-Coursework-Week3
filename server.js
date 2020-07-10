const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// get bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//Search booking id
app.get("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const searchResult = bookings.find((booking) => booking.id == bookingId);
  searchResult ? res.json(searchResult) : res.sendStatus(404);
});

const PORT = process.env.PORT || 5000;

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
