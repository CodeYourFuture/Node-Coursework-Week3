const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

/**** LEVEL 1 SOLUTION CODE ****/

app.use(express.json());
// CREATE new booking
app.post("/bookings", (req, res) => {
  // **NOTE**: INPUT VALIDATION HAS TO BE DONE BY THE CLIENT
  const newId = bookings[bookings.length - 1].id + 1;
  const newBooking = { id: newId, ...req.body };
  bookings.push(newBooking);
  res.sendStatus(201);
});

// RETRIEVE all bookingS
app.get("/bookings", (req, res) => {
  res.status(200).send(bookings);
});

// RETRIEVE a booking by id
app.get("/bookings/:id", (req, res) => {
  const booking = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (booking) {
    // if requested booking exists
    res.status(200).send(booking);
  } else {
    res.sendStatus(404);
  }
});

// DELETE a booking by id
app.delete("/bookings/:id", (req, res) => {
  const index = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (index >= 0) {
    // if requested booking exists
    bookings.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

/**** END OF LEVEL 1 SOLUTION ****/
