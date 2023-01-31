require('dotenv').config();
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const validator = require('email-validator');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
let bookings = require('./bookings.json');

const validateBook = (booking) => {
  if (
    !booking.title ||
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !validator.validate(booking.email) ||
    !booking.roomId ||
    !booking.checkInDate ||
    !booking.checkOutDate ||
    !moment(booking.checkOutDate).isAfter(booking.checkInDate)
  ) {
    return false;
  }
  return true;
};
app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.');
});

app.get('/bookings', (req, res) => {
  res.send(bookings);
});
app.get('/bookings/search', (req, res) => {
  if (!req.query.term && !req.query.date) return;

  if (req.query.term) {
    const keys = ['firstName', 'surname', 'email'];
    const filtered = bookings.filter((booking) =>
      keys.some((key) =>
        booking[key].toLowerCase().includes(req.query.term.toLowerCase())
      )
    );
    return res.send(filtered);
  }
  if (moment(req.query.date, 'YYYY-MM-DD').isValid()) {
    const filtered = bookings.filter(
      ({ checkInDate, checkOutDate }) =>
        checkInDate <= req.query.date && checkOutDate >= req.query.date
    );
    return res.send(filtered);
  }
});

app.get('/bookings/:bookingsId', (req, res) => {
  const haveBooking = bookings.find(({ id }) => id === +req.params.bookingsId);
  if (!haveBooking) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  return res.send(haveBooking);
});

app.post('/bookings', (req, res) => {
  const isValid = validateBook(req.body);
  if (!isValid) {
    return res.status(400).json(`Please enter valid data`);
  }
  bookings.push({
    ...req.body,
    id: bookings[bookings.length - 1].id + 1
  });
  return res.send(bookings);
});
app.put('/bookings/:bookingsId', (req, res) => {
  const index = bookings.findIndex(({ id }) => id === +req.params.bookingsId);
  const isValid = validateBook(req.body);
  if (!isValid) {
    return res.status(400).json(`Please enter valid data`);
  }
  if (index === -1) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  bookings[index] = { ...bookings[index], ...req.body };
  return res.send(bookings);
});
app.delete('/bookings/:bookingsId', (req, res) => {
  const haveBooking = bookings.find(({ id }) => id === +req.params.bookingsId);
  if (!haveBooking) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  bookings = bookings.filter(({ id }) => id !== +req.params.bookingsId);
  return res.send(bookings);
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
