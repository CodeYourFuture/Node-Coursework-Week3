const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// get all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// add/create bookings
app.post("/bookings", function (request, response) {
  const newBookings = {
    // id: uuid.v4(), //==> random id generator <==
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
    status: "active",
  };

  if (
    !newBookings.title ||
    !newBookings.firstName ||
    !newBookings.surname ||
    !newBookings.email ||
    !newBookings.roomId ||
    !newBookings.checkInDate ||
    !newBookings.checkOutDate
  ) {
    response.status(404);
  }

  bookings.push(newBookings);
  response.json(bookings);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
