const express = require('express');
const moment = require('moment');
const router = express.Router();
const bookings = require('../bookings.json');
const validator = require('email-validator');

router.get("/", (req, res) => {
  res.send(bookings);
});

router.post("/", (req, res) => {
  const lastIndex = bookings.length - 1;
  const lastId = bookings[lastIndex].id;
  const booking = req.body;
  const notValidBooking =
    !booking.title ||
    !booking.roomId ||
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !validator.validate(booking.email) ||
    !booking.checkInDate ||
    !booking.checkOutDate ||
    !moment(booking.checkOutDate).isAfter(booking.checkInDate);
  if (notValidBooking) {
    res.sendStatus(400);
  } else {
    const newBooking = {
      "id": lastId + 1,
      "roomId": booking.roomId,
      "title": booking.title,
      "firstName": booking.firstName,
      "surname": booking.surname,
      "email": booking.email,
      "checkInDate": booking.checkInDate,
      "checkOutDate": booking.checkOutDate,
    };
    bookings.push(newBooking);
    res.send(bookings);
  }
});

router.get('/search', (req, res) => {
    const date = req.query.date;
    const bookingsCoverDate = bookings.filter(({checkInDate, checkOutDate}) => moment(date).isBetween(checkInDate, checkOutDate));
    if(bookingsCoverDate.length === 0) {
        res.send({"message": `No booking found at ${date}`});
        return;
    }
    res.send(bookingsCoverDate);
})

router.get("/:bookingId", (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.find(({ id }) => id == bookingId);
  if (booking === undefined) {
    res.sendStatus(404);
    return;
  }
  res.send(booking);
});

router.delete("/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;
  const bookingIndex = bookings.findIndex(({ id }) => id == bookingId);
  if (bookingIndex === -1) {
    res.sendStatus(404);
    return;
  }
  bookings.splice(bookingIndex, 1);
  res.send(bookings);
});



module.exports = router;