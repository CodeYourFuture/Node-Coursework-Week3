const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

//read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

//read booking by ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const bookingRead = bookings.filter((booking) => {
    return booking.id === bookingId;
  });
  if (bookingRead.length > 0) {
    res.status(200).json(bookingRead);
  } else {
    res.status(404).json({ message: `Unable to find booking id:${bookingId}` });
  }
});

//create new booking

app.post("/bookings", (req, res) => {
  //check bookings for largest ID & roomId on file, and increase by 1
  let nextId =
    bookings.reduce(function (max, current) {
      return current.roomId > max.id ? current : max;
    }).id + 1;
  let roomId =
    bookings.reduce(function (max, current) {
      return current.roomId > max.roomId ? current : max;
    }).roomId + 1;

  const newBooking = {
    id: nextId,
    roomId: roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return res.status(400).json({
      msg: "Unable to make booking. Please include all required information",
    });
  }
  bookings.push(newBooking);
  res.status(200).json(bookings);
});

// delete booking by ID

app.delete("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const bookingLocation = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  if (bookingLocation === -1) {
    res
      .status(400)
      .send({ message: `Booking with ID: ${bookingId} not found` });
  } else {
      bookings.splice(bookingLocation, 1);
      res
        .status(200)
        .send({ message: `Booking ${bookingId} deleted.`, success: true });
    }
  });

  const listener = app.listen(process.env.PORT || 5555, function () {
    console.log("Your app is listening on port " + listener.address().port);
  });
