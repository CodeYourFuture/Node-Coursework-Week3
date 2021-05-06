const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// return all bookings
app.get("/bookings", (request, response) => {
  response.status(200);
  response.json(bookings);
});

// return the booking with the given id, else return 404 when id not found
app.get("/bookings/:id(\\d+)?", (request, response) => {
  // all the parameters are in string format
  // parseInt() needed to convert it to integer
  const id = parseInt(request.params.id);
  const filteredBookings = bookings.filter((booking) => booking.id === id);
  console.log(filteredBookings);
  if (filteredBookings.length > 0) {
    response.json(filteredBookings);
  } else {
    response.sendStatus(404);
  }
});

// check if the booking data is valid
const isValidBooking = (booking) => {
  const bookingKeys = Object.keys(bookings[0]);

  const hasUndefined = bookingKeys.some(
    (key) => booking[key] === "" || booking[key] === undefined
  );

  return !hasUndefined;
};

// create a new booking
app.post("/bookings", (request, response) => {
  /*
   Set the current booking's id as (lastElement.id + 1).
   and it is assumed that the post request body does not contain booking id.
   If the post request contains the booking id,
   it will over-write the server generated booking id.
  */
  const newBooking = {
    id: bookings[bookings.length - 1].id + 1,
    ...request.body,
  };

  if (isValidBooking(newBooking)) {
    bookings.push(newBooking);
    response.sendStatus(201);
  } else {
    response.status(400);
    response.send("Invalid or missing booking data!");
  }
});

// delete the booking with the given id
app.delete("/bookings/:id(\\d+)?", (request, response) => {
  const id = parseInt(request.params.id);

  const idFound = bookings.some((booking) => booking.id === id);

  if (idFound) {
    bookings = bookings.filter((booking) => booking.id !== id);
    response.sendStatus(204);
  } else {
    response.sendStatus(404);
  }
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
