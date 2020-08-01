const express = require("express");
const moment = require("moment");
const bodyParser = require("body-Parser");
const validator = require("email-validator");
const cors = require("cors");
const app = express();
// Packages in app
app.use(cors());
app.use(bodyParser.json());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

// Main Route
app.get("/", function (request, response) {
  response.json({
    student: "Afshin Karamfiar 😎",
    company: "Code Your Future",
  });
});

// TODO add your routes and helper functions here
// Validation
const properties_Validation = (booking) => {
  const { email, checkInDate, checkOutDate } = booking;
  // Properties Validation
  let errorObject = { Error: {} };
  let emptyProperties = [];
  for (const property in booking) {
    if (!booking[property]) emptyProperties.push(property);
  }
  // Check Empty Properties
  if (emptyProperties.length > 0) {
    errorObject.Error.is_Properties_Empty = `${emptyProperties.join(
      ", "
    )} is empty`;
  }
  // Check Email
  if (email && !validator.validate(email)) {
    errorObject.Error.is_Email_Valid = "Email is not Valid!";
  }
  // Check Date
  if (checkInDate && checkOutDate) {
    if (
      !moment(checkInDate).isValid() ||
      !moment(checkOutDate).isValid() ||
      !(moment(checkInDate) < moment(checkOutDate))
    ) {
      errorObject.Error.is_Date_Valid = "Date is not valid!";
    }
  }
  // Send Error Details
  if (Object.keys(errorObject.Error).length > 0) {
    return errorObject;
  }
  // Data is valid
  return false;
};

// Search Date
app.get("/booking/search", (request, response) => {
  // Get parameters
  const { term, date } = request.query;
  // Search keywords in bookings
  let result = [...bookings];
  if (term && term !== "") {
    result = result.filter(
      (booking) =>
        booking.firstName
          .toString()
          .toLowerCase()
          .indexOf(term.toString().toLowerCase()) >= 0 ||
        booking.surname
          .toString()
          .toLowerCase()
          .indexOf(term.toString().toLowerCase()) >= 0 ||
        booking.email
          .toString()
          .toLowerCase()
          .indexOf(term.toString().toLowerCase()) >= 0
    );
  }
  if (date && date !== "") {
    result = result.filter(
      (booking) =>
        moment(date).isValid() &&
        moment(booking.checkInDate) <= moment(date) &&
        moment(booking.checkOutDate) >= moment(date)
    );
  }
  // Send booking to the client
  response.status(200).json(result);
});

// Get Bookings
app.get("/bookings", (request, response) => {
  response.status(200).json(bookings);
});

// Get Booking by id
app.get("/booking/:id", (request, response) => {
  // Get booking id
  const { id } = request.params;
  // Check booking id in bookings
  let booking = null;
  if (id) {
    booking = bookings.find((booking) => booking.id === parseInt(id));
    if (!booking) {
      return response.status(404).send("Your booking is not in database!");
    }
  }
  // Send booking to the client
  response.status(200).json(booking);
});

// Create a booking
app.post("/booking", (request, response) => {
  // validation
  const dataValidation = properties_Validation(request.body);
  if (dataValidation) {
    return response.status(400).send(dataValidation);
  }
  // Create a new Booking
  request.body.id =
    bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1;
  bookings.push(request.body);
  // Send response to Client
  response.json(bookings);
});

// Update booking
app.put("/booking", (request, response) => {
  // Get booking id
  const { id } = request.body;
  let booking = null;
  // Check booking id in bookings
  if (id) {
    booking = bookings.find((booking) => booking.id === parseInt(id));
    if (!booking) {
      return response.status(404).send("Your booking is not in database!");
    }
  }
  // validation
  const dataValidation = properties_Validation(request.body);
  if (dataValidation) {
    return response.status(400).send(dataValidation);
  }
  // Update booking
  Object.assign(booking, request.body);
  // Send data to the client
  response.status(200).json(bookings);
});

// Delete Booking by id
app.delete("/booking/:id", (request, response) => {
  // Get booking id
  const { id } = request.params;
  // Check booking id in bookings
  let booking = null;
  if (id) {
    booking = bookings.find((booking) => booking.id === parseInt(id));
    if (!booking) {
      return response.status(404).send("Your booking is not in database!");
    }
  }
  // Delete booking in bookings
  bookings = bookings.filter((booking) => booking.id !== parseInt(id));
  // Send booking to the client
  response.status(200).json(bookings);
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
