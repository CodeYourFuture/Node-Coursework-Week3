const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

let idCount = bookings[bookings.length - 1].id;

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/:id", (req, res) => {
  const booking = bookings.find(booking => booking.id === +req.params.id);

  if (!booking) return res.status(404).send("Booking not found.");

  res.json(booking);
});

app.post("/bookings", (req, res) => {
  if (!req.body.roomId || !req.body.title || !req.body.firstName || !req.body.surname || !req.body.email || !req.body.checkInDate || !req.body.checkOutDate) return res.status(400).send("Please enter correct data.");

  idCount++;

  const booking = {
    id: idCount,
    roomId: req.body.roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  };

  bookings.push(booking);
  console.log(bookings);

  res.send("Booking created.");
});

app.delete("/bookings/:id", (req, res) => {
  const booking = bookings.find(booking => booking.id === +req.params.id);

  if (!booking) return res.status(404).send("Booking not found.");

  bookings = bookings.filter(booking => booking.id !== +req.params.id);

  res.send("Booking deleted.");
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + 3000);
});
