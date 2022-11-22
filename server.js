const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Read all bookings
app.get("/bookings", (req, res) => res.json(bookings));

//Add a new booking
app.post("/bookings", (req, res) => {
  let newBooking = {
    id: bookings.length + 1,
    roomId: req.body.roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkInDate,
  };
  if (
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res
      .status(400)
      .json({ msg: "Please fill in all required fields" });
  }
  bookings.push(newBooking);
  res.send(bookings);
}); // End of add a booking

// Read booking by ID
app.get("/bookings/:id", (req, res) => {
  let bookingId = parseInt(req.params.id);
  let found = bookings.some((booking) => booking.id === bookingId);
  if (found) {
    res.json(bookings.find((booking) => booking.id === bookingId));
  } else {
    res.status(404).json({
      msg: `No booking with id ${bookingId} found`,
    });
  }
});

//delete bookings by ID

app.delete("/bookings/:id", (req, res) => {
  let bookingsId = parseInt(req.params.id);
  let found = bookings.some((booking) => booking.id === bookingsId);
  if (found) {
    res.json(
      (bookings = bookings.filter(
        (booking) => booking.id !== bookingsId
      ))
    );
  } else {
    res.status(404).json({
      msg: `No booking with the id of ${bookingsId} found`,
    });
  }
});

const listener = app.listen(port, function () {
  console.log(
    "Your app is listening on port " + listener.address().port
  );
});
