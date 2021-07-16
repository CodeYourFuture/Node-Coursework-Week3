const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
let bookings = require("./bookings.json");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Welcome
app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Search term for email, firstName and surName
app.get("/bookings/search", (req, res) => {
  const term = req.query.term;

  if (term) {
    const searchTerm = bookings.filter((entry) => {
      return (
        entry.firstName.toLowerCase().includes(term.toLowerCase()) ||
        entry.surname.toLowerCase().includes(term.toLowerCase()) ||
        entry.email.toLowerCase().includes(term.toLowerCase())
      );
    });
    res.send(searchTerm);
  }
});

// Search by date
app.get("/bookings/search", (req, res) => {
  const date = req.query.date;
  const dates = moment(date);

  if (date) {
    const searchDate = bookings.filter((item) => {
      return (
        item.checkInDate.includes(dates.format("YYYY-MM-DD")) ||
        item.checkOutDate.includes(dates.format("YYYY-MM-DD"))
      );
    });
    res.send(searchDate);
  } else {
    res.status(404).send("Date not found, Try another date");
  }
});

// Create new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: "",
    ...req.body,
  };

  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = newBooking;

  const emailVal = validator.validate(email);

  // Check if email is valid
  if (!emailVal) {
    return res.send("Please enter a valid email address");
  }

  // Check dates
  const start = checkInDate;
  const end = checkOutDate;

  const checkDate = (start, end) => {
    var mStart = moment(start);
    var mEnd = moment(end);
    return mStart.isBefore(mEnd);
  };
  const checkDates = checkDate(start, end);

  if (!checkDates) {
    return res.send("Please enter correct dates");
  }

  if (
    !title ||
    title === "" ||
    !firstName ||
    firstName === "" ||
    !surname ||
    surname === "" ||
    !email ||
    email === "" ||
    !roomId ||
    roomId === "" ||
    !checkInDate ||
    checkInDate === "" ||
    !checkOutDate ||
    checkOutDate === ""
  ) {
    return res.status(400).json({ msg: "Please enter a value in all fields" });
  }

  bookings.push(newBooking);
  bookings.forEach((entry, index) => (entry.id = index + 1));
  res.json({
    msg: "Booking Added!",
    bookings,
  });
});

// Get one booking by id
app.get("/bookings/:id", (req, res) => {
  const { id } = req.params;

  const foundBooking = bookings.find((entry) => entry.id === parseInt(id));
  
  if (foundBooking) {
    res.json(foundBooking);
  } else {
    res.status(404).send(`Booking not found with id: ${id}`);
  }
});

// Delete a booking by id
app.delete("/bookings/:id", (req, res) => {
  const { id } = req.params;

  const foundBooking = bookings.find((entry) => entry.id === parseInt(id));

  if (foundBooking) {
    bookings = bookings.filter((entry) => entry.id !== parseInt(id));
    res.send(`Booking Deleted With Id: ${id}`);
  } else {
    res.status(404).send(`Booking not found with id: ${id}`);
  }
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is started at port: ${PORT}`));

/*

| method | example path                     | behaviour                                   |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | /bookings                        | return all bookings                         |
| GET    | /bookings/17                     | get one booking by id                       |
| GET    | /bookings/search?term=jones      | get all bookings matching a search term     |
| POST   | /bookings                        | create a new booking                        |
| DELETE | /bookings/17                     | delete a booking by id                      |
| GET    | /bookings/search?date=2019-05-20 | return all bookings spanning the given date |

*/



const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
