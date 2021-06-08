const express = require("express");
const cors = require("cors");
const lodash = require("lodash");
const date = require("date-and-time");
const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
  
});

//Read all bookings
app.get("/bookings", (request, response) => {
  response.status(200).json(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  console.log(request.params.id);
  const specifiedBooking = bookings.filter(
    (booking) => booking.id == request.params.id
  );
  if (specifiedBooking.length != 0) response.status(200).json(specifiedBooking);
  else response.status(404).json("The booking was not found");
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  const bookingId = request.params.id;
  const index = bookings.findIndex((booking) => booking.id == bookingId);
  if (index > -1) {
    bookings.splice(index, 1);
    response.status(200).json(bookings);
    response.end();
  } else response.status(404).send("The booking was not found");
});

//Create a new booking
app.post("/bookings", function (request, response) {
  const newBooking = {
    id: lodash.uniqueId("1"),
    title: request.body.title.trim(),
    firstName: request.body.firstName.trim(),
    surname: request.body.surname.trim(),
    email: request.body.email.trim(),
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate.trim(),
    checkOutDate: request.body.checkOutDate.trim(),
  };
  var isNotEmpty = true;
  for (var key in newBooking) {
    if (newBooking[key] === null || newBooking[key] === "") isNotEmpty = false;
  }
  const statusIn = date.isValid(request.body.checkInDate.trim(), "YYYY-MM-DD");
  const statusOut = date.isValid(request.body.checkOutDate.trim(), "YYYY-MM-DD");
  if (isNotEmpty && statusOut && statusIn) {
    bookings.push(newBooking);
    response.status(201).json(bookings);
    response.end;
  }
  else response.status(400).json("Data is not Valid");
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
