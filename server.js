const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const moment = require("moment");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

/**** LEVEL 3 SOLUTION CODE ****/

// get bookings by date
app.get("/bookings/search", (req, res) => {
  const incomingDate = req.query.date;
  if (incomingDate) {
    // if date value has been provided in the search query
    const result = bookings.filter(
      (booking) =>
        moment(booking.checkInDate).isSame(incomingDate, "day") ||
        moment(booking.checkOutDate).isSame(incomingDate, "day")
    );
    result.length > 0 ? res.status(200).send(result) : res.sendStatus(404);
  } else {
    res.sendStatus(400);
  }
});

/**** END OF LEVEL 3 SOLUTION ****/

/**** LEVELS 1, 2 AND 4 SOLUTION CODE ****/

app.use(express.json());
// CREATE new booking
app.post("/bookings", (req, res) => {
  const dataIsValid = validateBookingData(req.body);
  if (dataIsValid) {
    const newId = bookings[bookings.length - 1].id + 1;
    const newBooking = { id: newId, ...req.body };
    bookings.push(newBooking);
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

// RETRIEVE all bookingS
app.get("/bookings", (req, res) => {
  res.status(200).send(bookings);
});

// RETRIEVE a booking by id
app.get("/bookings/:id", (req, res) => {
  const booking = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (booking) {
    // if requested booking exists
    res.status(200).send(booking);
  } else {
    res.sendStatus(404);
  }
});

// DELETE a booking by id
app.delete("/bookings/:id", (req, res) => {
  const index = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (index >= 0) {
    // if requested booking exists
    bookings.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

// SUPPLEMENTARY CODE (LEVELS 2 AND 4) //

// booking data fields
const ALL_FIELDS = [
  "title",
  "firstName",
  "surname",
  "email",
  "roomId",
  "checkInDate",
  "checkOutDate",
];

// validate POST request booking data 
function validateBookingData(bookingData) {
  let result = dataIsComplete(bookingData);
  if (result === true) {
    result =
      emailIsValid(bookingData.email) &&
      datesAreOK(bookingData.checkInDate, bookingData.checkOutDate);
  }
  return result;
}

// check for missing or empty booking data field
const dataIsComplete = (bookingData) => {
  const fields = Object.keys(bookingData);
  return (
    fields.length === ALL_FIELDS.length &&
    fields.every(
      (fieldName) => fieldNameExists(fieldName) && bookingData[fieldName] !== ""
    )
  );
};

// check correctness of a field's name
const fieldNameExists = (fieldName) => {
  return ALL_FIELDS.find((value) => fieldName === value);
};

// validate customer email
const emailValidator = require("email-validator");
const emailIsValid = (email) => {
  return emailValidator.validate(email);
};

// check appropriateness of checkInDate and checkOutDate
const datesAreOK = (checkInDate, checkOutDate) => {
  return moment(checkOutDate).isAfter(checkInDate);
};

/**** END OF LEVELS 1, 2 AND 4 SOLUTION ****/