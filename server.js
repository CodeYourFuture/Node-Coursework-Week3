const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const indexOfLastbooking = bookings.length;
console.log(indexOfLastbooking);
const { request, response } = require("express");

const newBooking = {
  id: indexOfLastbooking + 1,
  title: "Miss",
  firstName: "Liv",
  surname: "Tyler",
  email: "tyler@example.com",
  roomId: 9,
  checkInDate: "2017-12-21",
  checkOutDate: "2017-12-23",
};

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
// TODO add your routes and helper functions here
app.post("/", (request, response) => {
  if (
    !newBooking.id ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response.status(404).json({ msg: `Please complete all section` });
  } else {
    const newBookingsData = bookings.push(newBooking);
    response.status(200).json(newBookingsData);
  }
});
app.get("/bookings", (request, response) => {
  response.status(200).json(bookings);
});
app.get("/bookings/:id", (request, response) => {
  const paramId = parseInt(request.params.id);
  const bookingId = bookings.some((booking) => booking.id === paramId);
  console.log(bookingId);
  if (bookingId) {
    response
      .status(201)
      .json(bookings.filter((booking) => booking.id === paramId));
  } else {
    response.status(404).send({
      message: `No booking by the id of ${paramId} exists, try another id.`,
    });
  }
});

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
