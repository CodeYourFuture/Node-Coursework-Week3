const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

const validateBooking = (booking) => {
  // false is any value is undefined
  if (Object.values(booking).some((value) => value == undefined)) return false;

  // false if check-in date is undefined
  // TODO: booking.checkInDate

  // false if check-out date is invalid
  // TODO:

  return true;
};

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Create a new booking
app.post("/bookings", (request, response) => {
  const newBookings = {
    id: bookings[bookings.length - 1].id + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  const isValidBooking = validateBooking(newBookings);
  console.log("isValidBooking: ", isValidBooking);

  if (isValidBooking) {
    bookings.push(newBookings);
    response.status(201).send(newBookings);
  } else {
    response.status(400).send({ Message: `Informations does not accepted.` });
  }
});

//Read all bookings from bookings.json
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

//Read one booking, specifide by an ID
app.get("/bookings/:bookingId", (request, response) => {
  // should always pass the radix parameter to parseInt
  const bookingId = parseInt(request.params.bookingId, 10);
  const filterBookingByID = bookings.find((item) => item.id === bookingId);
  if (filterBookingByID) {
    response.send(filterBookingByID);
  } else {
    response.send(
      `There is no item with the id number ${bookingId} that you requested`
    );
  }
});

// Delete a booking specified by an id
app.delete("/bookings/:bookingId", (request, response) => {
  const bookingById = parseInt(request.params.bookingId, 10);
  const bookingIndex = bookings.findIndex((item) => item.id === bookingById);
  if (bookingIndex >= 0) {
    bookings.splice(bookingIndex, 1);
    response.status(204);
  } else {
    response.status(404).send(`Can not find any booking with the ID number ${bookingById}`)
  }
});

// TODO add your routes and helper functions here
const port = 8080 || process.env.PORT;

const listener = app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});
