const express = require("express");
// const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// All bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// Create a booking
app.post("/bookings", function (request, response) {
  let newBooking = {
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
  newBooking.id = bookings.findIndex(newBooking) + 1;
  newBooking.roomId = newBooking.id + 10;

  return response.json(bookings);
});

// Get a booking by Id
app.get("/bookings/:id", function (request, response) {
  const searchedId = request.params.id;

  const searchResult = bookings.filter((booking) => booking.id == searchedId);

  response.json(searchResult);
});

// Delete a booking by ID
app.delete("/bookings/:id", function (request, response) {
  const searchedId = request.params.id;

  const index = bookings.findIndex((booking) => booking.id == searchedId);
  bookings.splice(index, 1);
  response
    .status(200)
    .json({
      msg: `Booking with id:${searchedId} has been deleted successfully.`,
    });
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
