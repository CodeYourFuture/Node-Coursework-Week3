const express = require("express");
const cors = require("cors");
const validator = require("email-validator");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// 1. Create a new booking

app.post("/bookings/", (request, response) => {
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  for (var property in newBooking) {
    // Level 2 Reject request if any property is missing
    if (!newBooking[property]) {
      return response.status(400).json({ msg: "Please fill in all fields" });
    }
    //level 4 validate email and check-in check-out dates
    if (!validator.validate(request.body.email)) {
      return response.status(400).json("Please enter a valid email address");
    }

    if (!moment(request.body.checkInDate).isBefore(request.body.checkOutDate)) {
      return response.status(400).json("Please enter valid dates");
    }
  }
  bookings.push(newBooking);
  response.json(bookings);
});

// 2.Read all bookings

app.get("/bookings", (request, response) => {
  response.json(bookings);
});

// 3.Read one booking, specified by Id

app.get("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);
  const idSearched = bookings.filter((booking) => booking.id === id);
  const found = bookings.some((booking) => booking.id === id);

  if (found) {
    response.json(idSearched);
  } else {
    response
      .status(404)
      .send(`No bookings match the id ${id}.Please enter a valid Id.`);
  }
});

// 4. Delete a booking, specified by Id

app.delete("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);

  const found = bookings.some((booking) => booking.id === id);

  if (found) {
    response.json({
      msg: "Message deleted",
      bookings: bookings.filter((booking) => booking.id !== id),
    });
  } else {
    response
      .status(404)
      .send(`No booking match the id ${id}. Please enter a valid Id.`);
  }
});

// Level 5 Create free-text-search
app.get("/bookings/search", function (request, response) {
  let queryTerm = request.query.term;

  const bookingsFound = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(queryTerm.toLowerCase())
  );

  if (queryTerm && bookingsFound.length > 0) {
    response.json(bookingsFound);
  } else {
    return response
      .status(404)
      .send("No message match your search. Please add another term!");
  }
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
