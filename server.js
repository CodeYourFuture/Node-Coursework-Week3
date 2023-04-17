const express = require("express");
const cors = require("cors");
const port = 3030;
const moment = require("moment");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//for creating new Id for new booking
function getNewUniqueId(array) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000) + 1; // generate a random number between 1 and 1000
  } while (array.some((obj) => obj.id === newId)); // check if the id already exists in the array
  return newId;
}

// Read all bookings
app.get("/bookings", function (req, res) {
  res.status(200).send(bookings);
});

// Search for bookings which span a date
app.get("/bookings/search", function (req, res) {
  const searchDate = req.query.date;

  if (!moment(searchDate, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send("Invalid date format");
  }

  const bookingsWithSearchDate = bookings.filter(
    (booking) =>
      moment(booking.checkInDate).isSameOrBefore(searchDate) &&
      moment(booking.checkOutDate).isSameOrAfter(searchDate)
  );

  if (bookingsWithSearchDate.length === 0) {
    return res.status(404).send("No bookings found for the given date");
  }

  // If bookings are found, return them to the client
  return res.status(200).send(bookingsWithSearchDate);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", function (req, res) {
  const searchId = Number(req.params.id);
  const bookingWithSearchId = bookings.find(
    (booking) => booking.id === searchId
  );

  if (!bookingWithSearchId) {
    return res.status(404).send("Booking not found");
  }

  // If the booking is found, return it to the client
  return res.status(200).send(bookingWithSearchId);
});

// Create a new booking
app.post("/bookings", function (req, res) {
  const {
    title,
    firstname,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  // Validate the incoming request body
  if (
    !title ||
    !firstname ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate ||
    title.trim() === "" ||
    firstname.trim() === "" ||
    surname.trim() === "" ||
    email.trim() === "" ||
    checkInDate.trim() === "" ||
    checkOutDate.trim() === ""
  ) {
    return res.status(400).send("Invalid request body");
  }

  //checking if email address is valid or not valid
  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email address");
  }

  //checking if checkOutDate is after checkInDate
  if (!moment(checkOutDate).isAfter(checkInDate)) {
    return res.status(400).send("Check-out date must be after check-in date");
  }

  const newBooking = {
    id: getNewUniqueId(bookings),
    title: title,
    firstname: firstname,
    surname: surname,
    email: email,
    roomId: roomId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };

  bookings.push(newBooking);

  res.status(201).send(bookings);
});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", function (req, res) {
  const searchId = Number(req.params.id);
  const bookingWithSearchId = bookings.find(
    (booking) => booking.id === searchId
  );

  if (!bookingWithSearchId) {
    return res.status(404).send("Booking not found");
  } else {
    const index = bookings.indexOf(bookingWithSearchId);
    console.log("index", index);
    bookings.splice(index, 1);
    // If the booking is found, return updated array with bookings
    return res.status(200).send(bookings);
  }
});

app.listen(port, () => {
  console.log("Listening to the port 3030...");
});
