const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

function isInvalidId(id, index, res) {
  if (index < 0) {
    res.status(400).send("No booking with Id: " + id + " is found");
  }
}

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// GET All Bookings

app.get("/bookings", function (req, res) {
  if (bookings.length <= 0) {
    res.status([]).send("No Available Data");
  }
  res.json(bookings);
});

// Search Bookings
app.get("/bookings/search", function (req, res) {
  let date = req.query.date;
  let term = req.query.term;

  let fltBookings = bookings
    .filter(
      (elt) =>
        !date ||
        (moment(elt.checkInDate) <= moment(date) &&
          moment(elt.checkOutDate) >= moment(date))
    )
    .filter(
      (elt) =>
        !term ||
        elt.firstName.toLowerCase().includes(term.toLowerCase()) ||
        elt.surname.toLowerCase().includes(term.toLowerCase()) ||
        elt.email.toLowerCase().includes(term.toLowerCase())
    );

  if (fltBookings.length <= 0) {
    (term || date) && res.status(400).send("No matching results");
  }

  if (!term && !date) {
    res.status(400).send("Please enter search term");
  }

  res.send(fltBookings);
});

// Get one booking by id
app.get("/bookings/:id", function (req, res) {
  let bookingIndex = bookings.findIndex((elt) => elt.id == req.params.id);

  isInvalidId(req.params.id, bookingIndex, res);

  if (bookingIndex >= 0) {
    let booking = bookings[bookingIndex];
    res.json(booking);
  }else {
    res.sendStatus(404).send("Not Found!");
  }
});

// Create new booking
app.post("/bookings", function (req, res) {
  for (const key in bookings[0]) {
    if (!req.body[key] && key !== "id") {
      res.status(400).send("Please type all fields.");
    }
  }

  if (validator.validate(req.body.email) === false) {
    res.status(400).send("Please write a valid email.");
  }

  if (moment(req.body.checkInDate) > moment(req.body.checkOutDate)) {
    res.status(400).send("Please type a valid dates.");
  }

  const newBooking = {
    id: req.body.id,
    roomId: req.body.roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    username: req.body.username,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  bookings.push(newBooking);
  res.json(newBooking);
});

// Delete one booking by id
app.delete("/bookings/:id", function (req, res) {
  let bookingIndex = bookings.findIndex((elt) => elt.id == req.params.id);

  isInvalidId(req.params.id, bookingIndex, res);

  bookings.splice(bookingIndex, 1);
  res.send({ message: "Booking has been successfully deleted." });
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
