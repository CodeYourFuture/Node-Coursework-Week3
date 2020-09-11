const express = require("express");
const cors = require("cors");
const moment = require("moment");
var validator = require("email-validator");
const app = express();
app.use(express.json());
app.use(cors());
moment().format();

// TODO add your routes and helper functions here

app.get("/bookings/search", function (request, response) {
  const queryDate = request.query.date;
  const term = request.query.term;
  if (!term && !queryDate) {
    response.status(400).json("There isn't any match");
    return;
  }

  if (moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    let result = bookings.filter(
      (booking) =>
        moment(queryDate).isBetween(
          booking.checkInDate,
          booking.checkOutDate
        ) ||
        moment(queryDate).isSame(booking.checkInDate) ||
        moment(queryDate).isSame(booking.checkOutDate)
    );
    result.length > 0
      ? response.send(result)
      : response.send("Not found a booking ton this date");
    return;
  } else if (queryDate) {
    response
      .status(400)
      .json('Please enter a valid date, format should like "YYYY-MM-DD"');
    return;
  }

  const searchTerm = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(term.toLowerCase())
  );
  if (term && searchTerm.length > 0) {
    response.json(searchTerm);
  } else if (term) {
    response.status(400).json("Sorry we couldn't find your term");
  }
});
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
//
//read all bookings
app.get("/bookings", (request, response) => {
  response.json(bookings);
});

app.post("/bookings", (request, response) => {
  if (!validator.validate(request.body.email)) {
    response.status(404).json("Please enter a valid email address");
    return;
  }

  let newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  if (
    newBooking.title &&
    newBooking.firstName &&
    newBooking.surname &&
    newBooking.email &&
    newBooking.roomId &&
    newBooking.checkInDate &&
    newBooking.checkOutDate
  ) {
    bookings.push(newBooking);
    response.json(bookings);
  } else {
    response.status(400).send("Please fill all the fields");
  }
});
//Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  let id = Number(request.params.id);
  let foundBooking = bookings.find((booking) => booking.id === id);
  if (foundBooking) {
    response.json(foundBooking);
  } else {
    response.status(404).json("Sorry, booking not found");
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  let id = parseInt(request.params.id);
  let bookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (bookingIndex > -1) {
    bookings.splice(bookingIndex, 1);
    response.json(bookings);
  } else {
    response.status(404).json("Please enter a valid ID");
  }
});
app.get("/bookings");

const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
