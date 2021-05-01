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

// Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Read one booking, specified by an ID. If the booking to be read cannot be found by id, return a 404.
app.get("/bookings/:id", (req, res) => {
  const getBookingId = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (getBookingId === undefined) {
    res.sendStatus(404).json({ message: "Booking Id not found" });
  } else {
    res.json(getBookingId);
  }
});

// Create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookings[bookings.length - 1].id + 1, // The id field is assigned upon successful post.
    ...req.body,
  };

  // check that all field is filled out
  if (
    newBooking.title !== "" &&
    newBooking.firstName !== "" &&
    newBooking.surname !== "" &&
    newBooking.email !== "" &&
    newBooking.roomId !== "" &&
    newBooking.checkInDate !== "" &&
    newBooking.checkOutDate !== ""
  ) {
    bookings.push(newBooking);
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

// Delete a booking, specified by an ID. If the booking for deletion cannot be found by id, return a 404.
app.delete("/bookings/:id", (req, res) => {
  const deleteBooking = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (deleteBooking === undefined) {
    res.sendStatus(404).json({ message: "Booking Id not found" });
  } else {
    res.sendStatus(204);
  }
});

// //Check that port 4050 is not in use otherwise set it to a different port
// const PORT = process.env.PORT || 4050;

// //Start our server so that it listens for HTTP requests!
// app.listen(PORT, () => console.log(`Your app is listening on port ${PORT}`));

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
