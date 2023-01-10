const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const validator = require("email-validator");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// Helper Functions
function isInvalidId(id, index, response) {
  if (index < 0) {
    response.status(400).send("No booking with Id: " + id + " is found");
  }
}
// Get all bookings
app.get("/bookings", (req, res) => {
  if (bookings.length <= 0) {
    res.status(500).send("No Available Data");
  }
  res.json(bookings);
});

// Search bookings
app.get("/bookings/search", (req, res) => {
  let searchDate = req.query.dat;
  let searchTerm = req.query.term;

  let filteredBookings = bookings.filter(
    (elt) =>
      (searchDate &&
        moment(elt.checkInDate) <= moment(searchDate) &&
        moment(elt.checkOutDate) >= moment(searchDate)) ||
      (searchTerm &&
        (elt.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elt.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elt.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (filteredBookings.length <= 0) {
    (searchTerm || searchDate) && res.status(400).send("No results");
  }
  if (!searchTerm && !searchDate) {
    res.status(400).send("Please enter search term");
  }
  res.send(filteredBookings);
});

app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
