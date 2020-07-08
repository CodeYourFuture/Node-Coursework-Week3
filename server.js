const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

app.use(express.json());
app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Use this array as your (in-memory) data store.
const bookings = require('./bookings.json');

app.get('/', function (request, response) {
  response.send(
    'Hotel booking server.  Ask for /bookings, /bookings/3, /bookings/search?term=jones, /bookings/search?date=2017-11-21 etc.'
  );
});

// Read all bookings

app.get('/bookings', function (request, response) {
  response.json(bookings);
});

const validateId = (id) => {
  return bookings.some((booking) => booking.id === id);
};
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !re.test(email);
};

const validateRequest = (request) => {
  return (
    request.body.title === '' ||
    request.body.firstName === '' ||
    request.body.surname === '' ||
    request.body.email === '' ||
    request.body.roomId === '' ||
    request.body.checkInDate === '' ||
    request.body.checkOutDate === ''
  );
};
//  Create a new bookings
app.post('/bookings', (request, response) => {
  const newId = bookings.length + 1;
  const newIdExist = validateId(newId);
  if (newIdExist) {
    newId++;
  }
  const duration = moment(request.body.checkOutDate).diff(
    request.body.checkInDate,
    'days'
  );

  if (
    validateEmail(request.body.email) ||
    validateRequest(request) ||
    duration < 0
  ) {
    response.status(400).json('Please Fill all the form fields, thanks!');
  } else {
    request.body.id = newId;
    bookings.push(request.body);
    response
      .status(201)
      .json(` Successfully A new chat with Id number ${newId}  is created.`);
  }
});

// free-text search and search by date
app.get('/bookings/search', (request, response) => {
  const searchTerm = request.query.term;
  const date = request.query.date;
  if (searchTerm) {
    const searchedBooking = bookings.filter((booking) => {
      return (
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.surname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    searchedBooking.length > 0
      ? response.json(searchedBooking)
      : response.status(404).send('Not found!');
  } else {
    const searchedBooking = bookings.filter(
      (booking) => booking.checkInDate === date || booking.checkOutDate === date
    );
    searchedBooking.length > 0
      ? response.json(searchedBooking)
      : response.status(404).send('Not found!');
  }
});

//  Read one booking specified by an ID
app.get('/bookings/:id', (request, response) => {
  const {id} = request.params;
  const booking = bookings.find((element) => element.id === Number(id));
  booking ? response.json(booking) : response.sendStatus(404);
});

//  Delete a booking by ID
app.delete('/bookings/:id', (request, response) => {
  const {id} = request.params;
  const indexToDelete = bookings.findIndex(
    (booking) => booking.id === Number(id)
  );
  if (indexToDelete != -1) {
    bookings.splice(indexToDelete, 1);
    response.sendStatus(204);
  } else {
    response.sendStatus(404);
  }
});

const portNumber = process.env.PORT || 5000;

const listener = app.listen(portNumber, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
