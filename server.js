const express = require("express");
const cors = require("cors");
const moment = require("moment"); // require
moment().format("YYYY-MM-DD");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { body, validationResult } = require("express-validator");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.post(
  "/bookings",
  [body("email").isEmail().withMessage("Please input a valid email")],
  function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }
    const expectedKeys = [
      "title",
      "firstName",
      "surname",
      "email",
      "roomId",
      "checkInDate",
      "checkOutDate",
    ];
    for (let item in request.body) {
      if (!request.body[item] || !expectedKeys.includes(item)) {
        response
          .status(400)
          .json("Please ensure your are passing the correct fileds");
        return;
      }
    }
    if (!moment(request.body.checkOutDate).isAfter(request.body.checkInDate)) {
      response.status(422).json("Checkout date must be after checkin date");
      return;
    }
    let newBooking = {
      id: bookings[bookings.length - 1].id + 1,
      title: request.body.title,
      firstName: request.body.firstName,
      surname: request.body.surname,
      email: request.body.email,
      roomId: request.body.roomId,
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate,
    };
    bookings.push(newBooking);
    response.json(bookings);
  }
);

app.get("/bookings", function (request, response) {
  response.send(bookings);
});

app.get("/bookings/search", function (request, response) {
  let searchTerm = request.query.term;
  let date = request.query.date;
  if (moment(date, "YYYY-MM-DD", true).isValid()) {
    let results = bookings.filter((booking) =>
      moment(date).isBetween(
        booking.checkInDate,
        booking.checkOutDate,
        undefined,
        "[)"
      )
    );
    results.length > 0
      ? response.json(results)
      : response.status(204).json("nothing was found on this date");
  } else if (typeof searchTerm == "string" && searchTerm.trim().length > 0) {
    const result = bookings.filter(
      (booking) =>
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    result.length > 0
      ? response.json(result)
      : response.status(204).json("Nothing matched this term");
  } else {
    response
      .status(400)
      .json("please ensure your date is in this format: YYYY-MM-DD ");
  }
});

app.get("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  let requestedBooking = bookings.find((booking) => booking.id === id);
  if (requestedBooking) {
    response.json(requestedBooking);
  } else {
    response.status(404).json("There is no booking with this ID");
  }
});

app.delete("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  let requestedBooking = bookings.findIndex((booking) => booking.id === id);
  if (requestedBooking > -1) {
    bookings.splice(requestedBooking, 1);
    response.json(bookings);
  } else {
    response.status(404).json("There is no booking with this ID");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
