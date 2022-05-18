const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//Create a new booking
app.post("/booking", function (req, res) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  const newBooking = {
    id: bookings.length,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  bookings.push(newBooking);
  res.json(bookings);
});

//Read one booking, specified by an ID
app.get("/booking/:id", function (req, res) {
  let id = parseInt(req.params.id);

  let foundBooking = bookings.filter((i) => i.id == id);

  if (!foundBooking.length == 0) {
    res.json({ Booking: bookings.filter((i) => i.id == id) });
  } else {
    return res.status(404).json("Booking cannot be found");
  }
});

//Delete a booking, specified by an ID
app.delete("/booking/:id", function (req, res) {
  let id = parseInt(req.params.id);

  let foundBooking = bookings.filter((i) => i.id == id);

  if (!foundBooking.length == 0) {
    res.json({ "All bookings": bookings.filter((i) => i.id !== id) });
  } else {
    return res.status(404).json("Booking cannot be found");
  }
});

const listener = app.listen(PORT, function () {
  console.log(`http://localhost:${PORT}`);
});
