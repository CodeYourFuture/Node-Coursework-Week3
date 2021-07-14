const express = require('express');
const router = express.Router();
const _ = require('lodash');

//Use this array as your (in-memory) data store.
const bookings = require("../../bookings");

// 2.Read All Bookings
router.get('/', (req, res) => {
  res.json(bookings);
});

// 1.Create a Booking
router.post('/', (req, res) => {
  const newBooking = {
    id: parseInt(_.uniqueId()),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: parseInt(_.uniqueId()),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  };

  // Checking if any property of the booking object is missing or empty.
  if (!newBooking.title) {
    res.status(400).json({ msg: `Please include a title` });
  } if (!newBooking.firstName) {
    res.status(400).json({ msg: `Please include a first name` });
  } if (!newBooking.surname) {
    res.status(400).json({ msg: `Please include a surname` });
  } if (!newBooking.email) {
    res.status(400).json({ msg: `Please include an email` });
  } if (!newBooking.checkInDate) {
    res.status(400).json({ msg: `Please include a check-in date in the format YYYY-MM-DD ` });
  } if (!newBooking.checkOutDate) {
    res.status(400).json({ msg: `Please include a check-out date in the format YYYY-MM-DD ` });
  } else {
    bookings.push(newBooking);
    res.json(bookings);
  }
});

// Level 5.Free Text Search
router.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  let wordMatch = bookings.filter(({ email, firstName, surname }) => {
    return (
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
  });

  if (wordMatch) {
    res.json(wordMatch);
  } else {
    res.status(404).json({ msg: `No booking that contains the word ${searchTerm}` });
  }
});


// 3.Read a Booking by Id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const idExist = bookings.some(booking => booking.id === parseInt(id));

  if (idExist) {
    const idFound = bookings.filter(booking => booking.id === parseInt(id));
    res.json(idFound);
  } else {
    res.status(404).json({ msg: `No booking with the id of ${id}` });
  }
});

// 4.Delete a Booking by Id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleteId = bookings.some(booking => booking.id === parseInt(id));

  if (deleteId) {
    const deletedBooking = bookings.filter(booking => booking.id !== parseInt(id));
    res.json({ msg: `Booking id: ${id} deleted!`, bookings: deletedBooking });
  } else {
    res.status(404).json({ msg: `No booking with the id of ${id}` });
  }
});

module.exports = router;