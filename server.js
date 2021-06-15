const express = require("express");
const cors = require("cors");
const lodash = require("lodash");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

const validator = require("email-validator");

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (_, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.post("/bookings", function (request, response) {
  if (
    !request.body.firstName ||
    !request.body.title ||
    !request.body.surname ||
    !request.body.email ||
    !request.body.roomId ||
    !request.body.checkInDate ||
    !request.body.checkOutDate ||
    !moment(request.body.checkOutDate).isSameOrAfter(
      request.body.checkInDate
    ) ||
    !validator.validate(request.body.email)
  ) {
    response.status(404).send(request.body);
  } else {
    // I had help with getting the id automatically generated
    let uniqueID = parseInt(lodash.uniqueId());
    uniqueID += bookings.length;
    let booking = request.body;
    booking["id"] = uniqueID;
    bookings.push(booking);
    response.status(200).send(booking);
  }
});

app.get("/bookings", function (_, response) {
  response.send(bookings);
});

app.delete("/bookings/:id", function (request, response) {
  let booking_to_delete;
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].id == request.params.id) {
      booking_to_delete = bookings[i];
      bookings.splice(i, 1);
    }
  }
  // I needed help for the next line
  if (booking_to_delete) {
    response.send(booking_to_delete);
  } else {
    response.status(404).send(request.params.id);
  }
});

// I had help on L3
app.get("/bookings/search", function (request, response) {
  // I had help to get two search options into this route
  if (request.query.date) {
    let bookingsInDateRange = [];
    let date = request.query.date;

    for (let bookingIndex in bookings) {
      let booking = bookings[bookingIndex];
      let checkInDate = booking["checkInDate"];
      let checkOutDate = booking["checkOutDate"];
      if (
        moment(date).isSameOrAfter(checkInDate) &&
        moment(date).isSameOrBefore(checkOutDate)
      ) {
        bookingsInDateRange.push(booking);
      }
    }
    response.send(bookingsInDateRange);
  } else if (request.query.term) {
    let term = request.query.term;
    term = term.toLowerCase();
    let foundBookings = searchBooking(term);
    response.send(foundBookings);
  }
});

const searchBooking = (term) => {
  let searchedArrayOfBookings = [];
  for (let booking of bookings) {
    const emailLowered = booking.email.toLowerCase();
    const firstNameLowered = booking.firstName.toLowerCase();
    const surnameLowered = booking.surname.toLowerCase();
    if (
      emailLowered.includes(term) ||
      firstNameLowered.includes(term) ||
      surnameLowered.includes(term)
    ) {
      searchedArrayOfBookings.push(booking);
    }
  }
  return searchedArrayOfBookings;
};

app.get("/bookings/:id", function (request, response) {
  let booking = bookings.find((booking) => booking.id == request.params.id);
  if (booking) {
    response.send(booking);
  } else {
    response.status(404).send(request.params.id);
  }
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
