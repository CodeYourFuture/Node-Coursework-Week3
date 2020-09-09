const express = require('express');
const cors = require('cors');
const bookings = require('./bookings.json');
const {check, validationResult} = require('express-validator');
const Moment = require('moment');
const MomentRange = require('moment-range');

const app = express();

app.use(express.json());

app.use(cors());
// app.use(expressValidator());

//Use this array as your (in-memory) data store.

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.');
});

// TODO add your routes and helper functions here
//get all the booking
app.get('/bookings', function (request, response) {
  response.send(bookings);
});
//read one booking specified by an id
app.get('/bookings/:id', function (request, response) {
  var bookingId = request.params.id;
  const booking = bookings.find(
    (booking) => booking.id === parseInt(bookingId)
  );
  if (!booking) {
    response.status(400).send('Booking not found');
  }
  response.send(booking);
});

//delete one booking by given id

app.delete('/bookings/:id', function (request, response) {
  const bookingId = request.params.id;
  const messgeToDelete = bookings.find(
    (booking) => parseInt(bookingId) === booking.id
  );
  //check if message with given id exist.
  if (!messgeToDelete) {
    response.status(400).send('The message with given does not exist');
  }
  //delete
  const index = bookings.indexOf(messgeToDelete);
  bookings.splice(index, 1);
  response.send(messgeToDelete);
});

//create new booking
app.post(
  '/bookings',
  //validate all field entered

  [
    check('firstName').isLength({
      min: 3,
    }),
    check('surname').isLength({
      min: 3,
    }),
    check('email').isEmail(),

    check('roomId').isInt(),
  ],
  (req, res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    if (Moment(req.body.checkOutDate).isBefore(req.body.checkInDate)) {
      return res
        .status(422)
        .send('Checkout date can not be earlier than check in date');
    }

    const booking = {
      id: bookings.length + 1,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
      roomId: req.body.roomId,
    };
    bookings.push(booking);
    res.send(booking);
  }
);

//Search for bookings which span a date (given by the client).

//It should accept requests of the following format:

//`/bookings/search?date=2019-05-20`

app.get('/bookings/search', function (req, res) {
  const {date} = req.query;
  console.log('date from query string', date);

  let isValid = Moment(date).isValid();

  console.log('is valid from is valid', isValid);
  if (!isValid) {
    res.status(400).send('please enter valid date');
  }

  foundBookings = bookings.filter(
    (booking) => booking.checkInDate === date || booking.checkOutDate === date
  );
  if (foundBookings.length === 0) {
    res.status(400).send('Nothing exist with given dates');
  }

  res.send(foundBookings);
});

//free search term
app.get('/bookings/search', function (req, res) {
  const {term} = req.query;
  let foundBookings = bookings.filter(
    (booking) =>
      booking.firstName.toLowerCase().includes(term) ||
      booking.surname.toLowerCase().includes(term) ||
      booking.email.toLowerCase().includes(term)
  );
  if (foundBookings.length === 0) {
    res.status(400).send('nothing exist with this search term');
  }
  res.send(foundBookings);
});
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
