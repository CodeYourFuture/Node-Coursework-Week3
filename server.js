const express = require("express");
const cors = require("cors");
const moment = require("moment");
const emailValidator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Adds a new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  // Loops through and checks if something is missing in the object
  for (let key in newBooking) {
    if (!newBooking[key]) {
      return res.status(400).send("Please enter all the information");
    }
  }

  // Check if the email id is valid
  if (!emailValidator.validate(newBooking.email)) {
    return res.status(400).send("Email not valid");
  }

  // Checks if the check in date and checkout dates are alright
  if (
    moment(newBooking.checkOutDate).diff(
      moment(newBooking.checkInDate),
      "days"
    ) < 0
  ) {
    return res.status(400).send("Error, please check the dates");
  }

  // If everything is present
  bookings.push(newBooking);
  res.json(bookings);
});

// Gets all the bookings
app.get("/bookings", (req, res) => res.json(bookings));

// Search
app.get("/bookings/search", (req, res) => {
  const date = req.query.date;
  const term = req.query.term;

  const result = bookings.filter(
    (booking) =>
      booking.checkInDate === date ||
      booking.checkOutDate === date ||
      booking.email.includes(term) ||
      booking.firstName.includes(term) ||
      booking.surname.includes(term)
  );

  res.json(result);
});

// Helper for finding a booking using it's id
const findBooking = (id) =>
  bookings.find((booking) => booking.id === Number(id));

// Finds a single booking
app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  if (findBooking(id)) {
    res.send(findBooking(id));
  } else {
    res.status(404).send(`Booking not found with the id ${id}`);
  }
});

// Deletes a booking
app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  if (findBooking(id)) {
    const index = bookings.indexOf(findBooking(id)); // Gets the index of the booking using id if it exists in the array
    bookings.splice(index, 1);
    res.json(bookings);
  } else {
    res
      .status(404)
      .send(`Could not delete, booking not found with the id ${id}`);
  }
});

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
