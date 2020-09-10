const express = require("express");
const cors = require("cors");
const moment = require("moment");
var validator = require("email-validator");
const app = express();
app.use(express.json());
app.use(cors());
moment().format();
app.get("/bookings/search", function (request, response) {
  const queryDate = request.query.date;
  const term = request.query.term;
  if (!term && !queryDate) {
    response.status(400).json("what are you doing here");
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
//create new booking
app.post("/bookings", (request, response) => {
  let keys = [
    "title",
    "firstName",
    "surname",
    "email",
    "roomId",
    "checkInDate",
    "checkOutDate",
  ];
  for (let key in request.body) {
    if (!request.body[key] || !keys.includes(key)) {
      response.status(404).json("Please fill in all fields");
      return;
    }
  }
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
  // if (
  //   newBooking.title &&
  //   newBooking.firstName &&
  //   newBooking.surname &&
  //   newBooking.email &&
  //   newBooking.roomId &&
  //   newBooking.checkInDate &&
  //   newBooking.checkOutDate
  // ) {
  bookings.push(newBooking);
  response.json(bookings);
  // } else {
  //   res.status(404).json(`Please fill all the fields`);
  // }
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
//add more validation including checking for decimal ids.
app.delete("/bookings/:id", (request, response) => {
  let id = parseInt(request.params.id);
  let bookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (bookingIndex !== -1) {
    bookings.splice(bookingIndex, 1);
    response.json(bookings);
  } else {
    response.status(404).json("Please enter valid ID");
  }
});
app.get("/bookings");
// TODO add your routes and helper functions here

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
