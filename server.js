const express = require("express");
const cors = require("cors");
const moment = require("moment");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//get all bookings

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// get booking by id

app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const booking = bookings.filter((item) => item.id === id);

  if (booking.length > 0) {
    res.status(200).json(booking);
  } else {
    res.status(404).json({ msg: `booking with id ${id} not found` });
  }
});

// post a booking

app.post("/bookings", (req, res) => {
  const booking = { id: bookings[bookings.length - 1].id + 1, ...req.body };

  if (
    booking.title !== "" &&
    booking.firstName !== "" &&
    booking.email !== "" &&
    booking.roomId !== "" &&
    booking.surname !== "" &&
    booking.checkInDate !== "" &&
    booking.checkOutDate !== ""
  ) {
    bookings.push(booking);
    res.status(201).json(bookings);
  } else {
    res.status(400).json({ msg: "please fill in all details" });
  }
});

// delete a booking by id

app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = bookings.findIndex((booking) => booking.id === id);

  if (index >= 0) {
    bookings.splice(index, 1);
    res.status(204);
  } else {
    res.status(404).json({ msg: `booking with id ${id} does not exist` });
  }
});

// TODO add your routes and helper functions here
app.listen(PORT);
