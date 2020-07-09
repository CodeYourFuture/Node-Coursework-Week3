const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require('moment')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// checkInDate": "2018-02-15",
// "checkOutDate": "2018-02-28"
app.get("/bookings/search", (req, res) => {
  const date = req.query.date;
  console.log(date)
  const searchDate = bookings.filter(
    (booking) => booking.checkInDate === date || booking.checkOutDate === date
  );
  if (searchDate.length > 0) {
    res.json(searchDate);
  } else {
    res.sendStatus(404);
  }
});

app.get("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const searchedBooking = bookings.find((booking) => booking.id == bookingId);
  if (searchedBooking) {
    res.json(searchedBooking);
  } else {
    res.sendStatus(404);
  }
});

app.post("/bookings", (req, res) => {
  if (
    "title" in req.body &&
    "firstName" in req.body &&
    "surname" in req.body &&
    "roomId" in req.body &&
    "email" in req.body
  ) {
    bookings.push(req.body);
  } else {
    res.send("Please fill the form");
  }
});

app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const checkLength = bookings.length;
  bookings = bookings.filter((booking) => booking.id != bookingId);
  if (checkLength > bookings.length) {
    res.json({ "Booking deleted": true });
  } else {
    res.sendStatus(404);
  }
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
