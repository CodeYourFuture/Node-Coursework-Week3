const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// read all bookings
app.get("/booking", function (request, response) {
  response.send({ bookings });
});

// read one booking specified by an id
app.get("/booking/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.find((booking) => booking.id === id);
  if (booking) {
    response.send(booking);
  } else {
    response.status(404).send("Booking not found");
  }
});


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
