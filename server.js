const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings/:bookingId", function (request, response) {
  const { bookingId } = request.params;
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id !== Number(bookingId)
  );
});

// TODO add your routes and helper functions here

app.get("/bookings", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/", function (request, response) {
  response.send();
});

//if can not get booking then return 404

app.post("/", function (request, response) {
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
    checkOutDate === undefined ||
    id === undefined
  ) {
    const responseMiss = {
      message: ` you are missing something `},
    };
    return response.status(400).json(responseMiss);
  }

  const theBookingObject = {
    id: messages.length,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };
  messages.push(theBookingObject);
  response.json("You've POST a booking");
});

app.delete("/", function (request, response) {
  const { bookingId } = request.params;
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id !== Number(bookingId)
  );

  //if can delete booking then return 404
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
