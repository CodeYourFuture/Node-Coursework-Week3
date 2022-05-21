const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// TODO add your routes and helper functions here

app.get("/bookings", function (request, response) {
  response.send(bookings);
});

app.get("/bookings/search", function (request, response) {
  const searchWord = request.query.term.toLowerCase();
  const searchResults = bookings.filter(
    ({ firstName, surname, email }) =>
      firstName.toLowerCase().includes(searchResults) ||
      surname.toLowerCase().includes(searchResults) ||
      email.toLowerCase().includes(searchResults)
  );
  response.send(searchResults);
});

app.get("/", function (request, response) {
  response.send("The Hotel Booking Server, use /bookings");
});

app.get("/bookings/:bookingId", function (request, response) {
  const { bookingId } = request.params;
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id !== Number(bookingId)
  );
  response.json(bookings[bookingIndex]);
});

//if can not get booking then return 404

app.post("/bookings", function (request, response) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;

  if (
    title === undefined ||
    firstName === undefined ||
    surname === undefined ||
    email === undefined ||
    roomId === undefined ||
    checkInDate === undefined ||
    checkOutDate === undefined
  ) {
    const responseMiss = {
      message: ` you are missing something here(e.g. title, email, check in date), please try again `,
    };
    return response.status(400).json(responseMiss);
  }

  const theBookingObject = {
    id: bookings.length,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };
  bookings.push(theBookingObject);
  response.json("You've POST a booking");
});

app.delete("/", function (request, response) {
  const { bookingId } = request.params;
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id !== Number(bookingId)
  );

  //if can not delete booking then return 404
  if (bookingIndex > -1) {
    response.json(bookings[bookingIndex]);
    bookings.splice(bookingIndex, 1);
  } else {
    response
      .status(404)
      .status(`sorry could not find that item with id ${bookingId}`);
  }
});

const listener = app.listen(3008, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
