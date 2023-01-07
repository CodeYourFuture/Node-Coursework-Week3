const express = require("express");
const cors = require("cors");
// const crypto = require("crypto");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/bookings", (req, res) => {
  if (
    !req.body.title ||
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.roomId ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
  ) {
    res.sendStatus(400);
    return;
  }
  const createdBooking = {
    // id: crypto.randomUUID(),
    id: Number(new Date()),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  bookings.push(createdBooking);
  console.log(createdBooking);
  res.status(201).json(createdBooking);
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/:id", (req, res) => {
  const foundBooking = bookings.find(
    (booking) => booking.id === Number(req.params.id)
  );
  if (!foundBooking) {
    res.sendStatus(404);
    return;
  }
  res.json(foundBooking);
});

app.delete("/bookings/:id", (req, res) => {
  const delBookingId = Number(req.params.id);
  const foundBookingIndex = bookings.findIndex(
    (booking) => booking.id === delBookingId
  );
  if (foundBookingIndex < 0) {
    res.sendStatus(440);
    return;
  }
  bookings.splice(foundBookingIndex, 1);
  res.sendStatus(204);
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
