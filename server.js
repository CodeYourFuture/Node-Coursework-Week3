const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Get all bookings
app.get("/bookings", function (request, response) {
  if (bookings.length <= 0) {
    response.status(500).send("No Available Data");
  }
  response.json(bookings);
});

// Create new booking
app.post("/bookings", function (request, response) {
  for (const key in bookings[0]) {
    if (!request.body[key] && key !== "id") {
      response.status(400).send("Please enter all fields");
    }
  }

  if (validator.validate(request.body.email) === false) {
    response.status(400).send("Please enter a valid email");
  }

  if (moment(request.body.checkInDate) > moment(request.body.checkOutDate)) {
    response.status(400).send("Please enter a valid dates");
  }

  const newBooking = {
    id: uuid.v4(),
    roomId: request.body.roomId,
    title: request.body.title,
    firstName: request.body.firstName,
    username: request.body.username,
    email: request.body.email,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  bookings.push(newBooking);
  response.json(newBooking);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
