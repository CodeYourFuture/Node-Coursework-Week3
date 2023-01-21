const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/booking", function (req, res) {
  res.send(bookings);
});

app.get("/booking/:id", function (req, res) {
  const bookingID = Number(req.params.id);
  const booking = bookings.find((booking) => booking.id === bookingID);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingID
  );
  if (bookingIndex === -1) {
    res.status(404).send("unknown ID");
  } else {
    res.status(200).json(booking);
  }
});

app.delete("/booking/:id", function (req, res) {
  const bookingDeleteID = Number(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingDeleteID
  );
  if (bookingIndex === -1) {
    res.status(404).send("unknown ID");
  } else {
    bookings.splice(bookingIndex, 1);
    res.send(bookings);
  }
});

app.post("/booking", function (req, res) {
  const newBooking = req.body;
  const bookingID = bookings.length + 1;
  newBooking.id = bookingID;
  const {
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  } = newBooking;
  const validation =
    !!roomId &&
    !!title &&
    !!firstName &&
    !!surname &&
    !!email &&
    !!checkInDate &&
    !!checkOutDate;
  if (!validation) {
    res.status(400).send("validation not met");
  } else {
    bookings.push(newBooking);
    res.status(201).send(bookings);
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(5001 || process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
