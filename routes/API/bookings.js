const express = require("express");

const router = express.Router();
const uuid = require("uuid");
const bookings = require("../../data/Bookings");
const moment = require("moment");
const emailValidator = require("email-validator");

//get all booking
router.get("/", (req, res) => {
  res.send(bookings);
});

router.get("/search", (req, res) => {
  const wordEntered = req.query.term;
  const dateEntered = req.query.date;

  //search by firstName,surName & email
  if (wordEntered) {
    const newBooking = bookings.filter(
      (booking) =>
        booking.firstName.toUpperCase().includes(wordEntered.toUpperCase()) ||
        booking.surname.toUpperCase().includes(wordEntered.toUpperCase()) ||
        booking.email.toUpperCase().includes(wordEntered.toUpperCase())
      //(booking.firstName || booking.surname || booking.email)
      //   .toUpperCase()
      //   .includes(wordEntered)
    );

    return res.send(newBooking);

    //search by date
  } else {
    if (moment(dateEntered, "YYYY-MM-DD", true).isValid()) {
      return res.send(
        bookings.filter((booking) =>
          moment(dateEntered).isBetween(
            booking.checkInDate,
            booking.checkOutDate,
            null,
            "[]"
          )
        )
      );
    } else {
      return res
        .status(404)
        .json({ msg: "please enter the date format correctly YYYY-MM-DD" });
    }
  }
});

//get one booking with a specific id
router.get("/:id", (req, res) => {
  res.send(
    bookings.filter((booking) => booking.id === parseInt(req.params.id))
  );
});

//create new booking

router.post("/", (req, res) => {
  const {
    title,
    firstName,
    surName,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;
  //check all field been filled up
  if (
    !title ||
    !firstName ||
    !surName ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res.status(404).send("please Enter all of the fields");
    //validate email
  } else if (!emailValidator.validate(email)) {
    res.status(404).json({ msg: "please enter the valid email" });
    //validate check in date is before the che out date
  } else if (!moment(checkOutDate).isAfter(checkInDate)) {
    res
      .status(404)
      .json({ msg: "Check out date should be greater than the check in date" });
  }
  const newBooking = {
    id: uuid.v4(),
    title,
    firstName,
    surName,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };
  bookings.push(newBooking);
  res.send(bookings);
});

//Delete booking

router.delete("/:id", (req, res) => {
  res.send(
    bookings.filter((booking) => booking.id !== parseInt(req.params.id))
  );
});

module.exports = router;
