const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

// TODO add your routes and helper functions here
//Create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  const lastBooking = bookings[bookings.length - 1];
  const newId = lastBooking.id + 1;
  newBooking.id = newId;
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});
//Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});
//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find((booking) => booking.id === bookingId);
  if (!booking) {
    res.status(404).send("Booking not found.");
  } else {
    res.json(booking);
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const index = bookings.findIndex((booking) => booking.id === bookingId);
  if (index === -1) {
    res.status(404).send("Booking not found.");
  } else {
    const deletedBooking = bookings.splice(index, 1)[0];
    res.json(deletedBooking);
  }
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on 3000 ");
});
