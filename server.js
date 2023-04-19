const express = require("express");
const cors = require("cors");
const moment = require("moment");
const emailValidator = require("email-validator");

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use(cors());

// Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// Creating a new Booking + Level 2 simple validation
app.post("/bookings", (req, res) => {
  const newBooking = req.body;

  // Destructuring the bookings
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = newBooking;

  // Validation helper functions
  const isEmpty = (value) =>
    typeof value === "string" ? !value.trim() : !value;
  const isInvalidRoomId = (roomId) => isNaN(parseInt(roomId));
  const isInvalidDate = (date) => new Date(date).toString() === "Invalid Date";

  // Level 4 (Optional, advanced) - advanced validation
  // Email validation
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: "Invalid email address ⛔️" });
  }

  // Check-in and check-out date validation
  if (moment(checkOutDate).isBefore(checkInDate)) {
    return res
      .status(400)
      .json({ message: "Checkout date should be after check-in date ⛔️" });
  }
  // Level 2
  // Check if the properties are valid
  if (
    [
      isEmpty(title),
      isEmpty(firstName),
      isEmpty(surname),
      isEmpty(email),
      isEmpty(roomId),
      isEmpty(checkInDate),
      isEmpty(checkOutDate),
      isInvalidRoomId(roomId),
      isInvalidDate(checkInDate),
      isInvalidDate(checkOutDate),
    ].some(Boolean)
  ) {
    res.status(400).json({ message: "Booking data is invalid ⛔️" });
  } else {
    bookings.push(newBooking);
    res.status(201).json({ message: "Booking created successfully 😅 👍🏼" });
  }

  // Write the updated bookings to the JSON file
  fs.writeFile("./bookings.json", JSON.stringify(bookings), (err) => {
    if (err) {
      return res.status(500).json({ error: "Unable to write to file" });
    }
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  });
});

// Reeding all Bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// // Level 3 ----------------------- (Optional, advanced) - search by date
// app.get("/bookings/search", (req, res) => {
//   const date = req.query.date;
//   console.log(`Searching for bookings on date: ${date}`);

//   if (!date) {
//     return res.status(400).send("Please provide a date");
//   }

//   const bookingsOnData = bookings.filter((booking) => {
//     const startDate = moment(booking.checkInDate);
//     const endDate = moment(booking.checkOutDate);

//     const searchDate = moment(date);

//     return searchDate.isBetween(startDate, endDate, null, "[]");
//   });

//   res.send({ results: bookingsOnData });
// });

// // Level 5 ----------------------- free-text search
// app.get("/bookings/search-term", (req, res) => {
//   const term = req.query.term;

//   if (!term) {
//     return res.status(400).send("Please provide a search term 😊");
//   }
//   console.log(`Searching for bookings with term: ${term}`);

//   const bookingsWithTerm = bookings.filter((booking) => {
//     const { email, firstName, surname } = booking;

//     return (
//       email.toLowerCase().includes(term.toLocaleLowerCase()) ||
//       firstName.toLowerCase().includes(term.toLocaleLowerCase()) ||
//       surname.toLowerCase().includes(term.toLocaleLowerCase())
//     );
//   });

//   res.send({ results: bookingsWithTerm });
// });

app.get("/bookings/search", (req, res) => {
  const { term, date } = req.query;

  if (!term && !date) {
    return res.status(400).send("Please provide a search term or date 😊");
  }

  console.log(`Searching for bookings with term: ${term} or date: ${date}`);

  const filteredBookings = bookings.filter((booking) => {
    const { email, firstName, surname, checkInDate } = booking;
    const formattedCheckInDate = new Date(checkInDate)
      .toISOString()
      .split("T")[0];

    if (term) {
      return (
        email.toLowerCase().includes(term.toLocaleLowerCase()) ||
        firstName.toLowerCase().includes(term.toLocaleLowerCase()) ||
        surname.toLowerCase().includes(term.toLocaleLowerCase())
      );
    } else if (date) {
      return formattedCheckInDate === date;
    }
  });

  if (filteredBookings.length === 0) {
    return res.status(404).send("No results found 😔");
  }

  res.send({ results: filteredBookings });
});

// Read one Bookings by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const bookingsById = bookings.find((booking) => booking.id === bookingId);
  if (bookingsById) {
    res.json(bookingsById);
  } else {
    res.status(404).json({ message: "Booking not found ⛔️" });
  }
});

// Delete a message, by ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  if (bookingIndex !== -1) {
    bookings.splice(bookingIndex, 1);
    res.json({ message: "Booking deleted successfully 😅 👍🏼" });
  } else {
    res.status(404).json({ message: "Booking not found ⛔️" });
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
