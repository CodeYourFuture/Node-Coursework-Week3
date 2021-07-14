const express = require('express');
const router = express.Router();
const _ = require('lodash');

//Use this array as your (in-memory) data store.
const bookings = require("../../bookings");

// TODO add your routes and helper functions here

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

  bookings.push(newBooking);
  res.json(bookings);
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