const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// Helper function to find a booking by ID
function findBookingById(id) {
  return bookings.find((booking) => booking.id == id);
}

// Helper function to generate a new booking ID
function generateBookingId() {
  return Math.max(...bookings.map((booking) => booking.id), 0) + 1;
}

function generateBookingroomId() {
  return Math.max(...bookings.map((booking) => booking.roomId), 0) + 1;
}

// Route to create a new booking
app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).send("Missing or empty booking property.");
  } else if (!validator.isEmail(newBooking.email)) {
    res.status(400).send("Invalid email address.");
  } else {
    const checkInDate = moment(newBooking.checkInDate, "YYYY-MM-DD");
    const checkOutDate = moment(newBooking.checkOutDate, "YYYY-MM-DD");
    if (
      !checkInDate.isValid() ||
      !checkOutDate.isValid() ||
      !checkOutDate.isAfter(checkInDate)
    ) {
      res.status(400).send("Invalid date(s).");
    } else {
      newBooking.id = generateBookingId();
      newBooking.roomId = generateBookingroomId();
      bookings.push(newBooking);
      res.status(201).send("you added new booking");
    }
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
