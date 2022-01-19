const express = require("express");
// const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Create A booking
app.post("/bookings", function (request, response) {
  const newBooking = {
    id: 0,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: 0,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  bookings.push(newBooking);
  newBooking.id = bookings.indexOf(newBooking) + 1;
  newBooking.roomId = newBooking.id + 5;
  return response.json(bookings);
});

// See All Bookings
app.get("/bookings", function (request, response) {
  response.status(200).json(bookings);
});

// Get a booking with a specific ID
app.get("/bookings/:id", function (request, response) {
  const requestedBooking = bookings.filter(
    (booking) => booking.id == request.params.id
  );
  if (requestedBooking.length <= 0) {
    response.status(404).json({
      msg: `You have searched for an invalid id:${request.params.id}`,
    });
  } else {
    response.status(200).json(requestedBooking);
  }
});

app.delete("/bookings/:id", function (request, response) {
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id == request.params.id
  );
  if (bookingIndex < 0) {
    response.status(404).json({
      msg: `You have searched for an invalid Booking id:${request.params.id}`,
    });
  } else {
    bookings.splice(bookingIndex, 1);
    response.status(200).json({
      msg: `Booking with id:${request.params.id} has been deleted`,
    });
  }
});

// Delete a booking

// TODO add your routes and helper functions here
const PORT = process.env.PORT || 5001;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
