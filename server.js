const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  //creating id for the new booking
  newBooking.id = Math.max(...bookings.map((booking) => booking.id), 0) + 1;
  bookings.push(newBooking);
  res.json(bookings);
});
//read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});
// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  let filtered = bookings.find((booking) => booking.id === bookingId);
  if (filtered) {
    res.json(filtered);
  } else {
    res.status(404).send("the booking to be read cannot be found by id");
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  if (bookingIndex === -1) {
    res.status(404).send("the booking to be delete cannot be found by id");
  } else {
    bookings.splice(bookingIndex, 1);
    res.json(bookings);
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
