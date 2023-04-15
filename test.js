const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

const bookings = require("./bookings.json");

app.get("/bookings/search", (req, res) => {
  const searchQuery = req.query.term;
  const dateQuery = req.query.date;
  const dateToFind = moment(new Date(dateQuery));
  const isDateBetween = dateToFind.isBetween(fromDate, toDate);

  const matchedBookings = bookings.filter();

  if (!dateQuery) {
    const matchedBookings = bookings.filter(matchedSearchQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else if (!searchQuery) {
    const matchedBookings = bookings.filter(matchedDateQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else {
    const matchedBookings = bookings.filter(allMatchedQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  }

  function matchedSearchQueries(bkng) {
    return (
      bkng.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function matchedDateQueries(bkng) {
    return (
      bkng.checkInDate.includes(dateQuery) ||
      bkng.checkOutDate.includes(dateQuery) ||
      isDateBetween === true
    );
  }

  function allMatchedQueries(bkng) {
    return (
      bkng.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.checkInDate.includes(dateQuery) ||
      bkng.checkOutDate.includes(dateQuery) ||
      isDateBetween === true
    );
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
