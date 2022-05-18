const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// Create a new booking
let idCounter = bookings.length;

app.post("/bookings", (request, response) => {
  bookings.push({
    id: ++idCounter,
    ...request.body,
  });
  response.sendStatus(201);
});

//Read all bookings
app.get("/bookings", (request, response) => {
  response.json(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", async (request, response) => {
  const bookingId = Number(await request.params.id);
  const bookingFound = bookings.find((booking) => {
    return booking.id === bookingId;
  });
  if (!bookingFound) {
    response
      .status(404)
      .send("Booking cannot be found by id, please try a different number.");
  }
  response.send(bookingFound);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  const bookingId = Number(request.params.id);
  const bookingToBeDeleted = bookings.find((booking) => {
    return booking.id === bookingId;
  });

  if (!bookingToBeDeleted) {
    response
      .status(404)
      .send(
        "Booking id cannot be found in the database, please try a different booking."
      );
  }

  bookings = bookings.filter((booking) => {
    return booking.id !== bookingId;
  });

  response.json(bookings);
});
