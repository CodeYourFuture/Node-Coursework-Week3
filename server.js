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

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.find(booking => booking.id === id);
  if (booking) {
    response.json(booking);
  } else {
    response.status(404).send("Booking not found");
  }
});

app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).send("Booking is not complete");
  }
  bookings.push(newBooking);
  response.json(bookings);
});

app.delete("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.find(booking => booking.id === id);
  if (booking) {
    const index = bookings.indexOf(booking);
    bookings.splice(index, 1);
    response.json(bookings);
  } else {
    response.status(404).send("Booking not found");
  }
});

const port = process.env.PORT || 3000;
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
