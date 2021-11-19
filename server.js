const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read(GET) ALL bookings with this route `/bookings`
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

//Search bookings with this route `/bookings/search?term=CYF`
app.get("/bookings/search", (req, res) => {
  const searchQuery = req.query.term.toLowerCase();
  if (searchQuery) {
    const searchBookings = (searchInput) => {
      return bookings.filter(
        (obj) =>
          obj.firstName.toLowerCase().includes(searchInput) ||
          obj.surname.toLowerCase().includes(searchInput) ||
          obj.email.toLowerCase().includes(searchInput)
      );
    };
    res.send(searchBookings(searchQuery));
  } else res.status(400).send("No Bookings Found With The Provided Query");
});

// Read(GET) one booking specified by an ID with this route `/booking/0`
app.get("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  const bookingSpecified = bookings.find(
    (booking) => booking.id === parseInt(bookingId)
  );

  if (bookingSpecified) {
    res.json(bookingSpecified);
  } else {
    res.status(404).send(`There is no booking with the id: ${bookingId}`);
  }
});

// Create(POST) a new booking
app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  let previousBookingId = bookings[bookings.length - 1].id;

  const newBooking = {
    id: previousBookingId + 1,
    ...req.body,
  };

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res
      .status(400)
      .send({ msg: "Please provide an input in all the fields." });
  }
  bookings.push(newBooking);
  res.status(201).json({ msg: "New booking has been confirmed", bookings });
});

// Delete a booking specified by an ID with this route `/booking/0`
app.delete("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;

  const bookingSpecified = bookings.find(
    (booking) => booking.id === parseInt(bookingId)
  );

  if (bookingSpecified) {
    bookings = bookings.filter((booking) => booking.id !== parseInt(bookingId));
    res.send(`Booking has been deleted with the specified Id: ${bookingId}`);
  } else {
    res.status(404).send(`There is no booking with the id: ${bookingId}`);
  }
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
