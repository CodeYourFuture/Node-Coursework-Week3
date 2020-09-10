const express = require("express");
const cors = require("cors");
const Joi = require('joi');
const moment = require('moment')

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", function (request, response) {
  response.send(bookings);
});


app.get("/bookings/search", function (request, response) {
  const datequery = request.query.date
  const term = request.query.term
  const date = moment(datequery, 'YYYY-MM-DD', true)

  if (moment(date).isValid()) {
    let result = bookings.filter(booking => moment(datequery).isBetween(booking.checkInDate, booking.checkOutDate) || moment(date).isSame(booking.checkInDate) || moment(date).isSame(booking.checkOutDate))
    result.length > 0 ? response.send(result) : response.send('Not found a booking on this date')
  } else if (datequery && !moment(date).isValid()) {
    response.status(400).json('Please enter a valid date, format should like "YYYY-MM-DD"')
  }
  if (term) {
    let result = bookings.filter((booking) => `${booking.firstName} ${booking.surname} ${booking.email}`.toLowerCase().includes(term.toLowerCase()))
    result.length > 0 ? response.send(result) : response.send('Not found a booking with this term')
  } else {
    response.status(400).json('Bad request')
  }
});


app.get("/bookings/:id", function (request, response) {
  const id = Number(request.params.id)
  if (!isNaN(id)) {
    const booking = bookings.find(booking => booking.id === id)
    if (booking) {
      const booking = bookings.filter(booking => booking.id === id)
      response.send(booking)
    } else {
      response.status(404).json({ msg: 'cannot be found by id' })
    }
  } else {
    response.status(400).json({ msg: 'type a valid id' })
  }
});


app.delete("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id)
  const booking = bookings.find(booking => booking.id === id)
  if (booking) {
    const currentBookings = bookings.filter(booking => booking.id !== id)
    response.send({ msg: 'The booking is deleted', bookings: currentBookings })
  } else {
    response.status(404).json({ msg: 'cannot be found by id' })
  }
});

app.post("/bookings", function (request, response) {
  let keys = ["title", "firstName", "surname", "email", "roomId", "checkInDate", "checkOutDate"];
  for (let key in request.body) {
    if (!keys.includes(key)) {
      response.status(400).json("We dont have such a data");
      return;
    } else if (!request.body[key] && keys.includes(key)) {
      response.status(400).json("Please fill in all fields");
      return;
    }
  }
  if (request.body) {
    moment(request.body.checkOutDate).isBefore(request.body.checkInDate) && response.status(400).json("CheckOutDate must be later then CheckInDate")
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    !emailRegex.test(request.body.email) && response.status(400).json("Please enter a valid email")
    const roomNumbers = /^[1 - 100]/
    roomNumbers.test(request.body.roomId) && response.status(400).json("We dont have a room with this number")
  }
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  }
  bookings.push(newBooking)
  response.send(bookings);
}
);

// Validation with Joi
// app.post("/bookings", function (request, response) {
//   const schema = Joi.object({
//     title: Joi.string().required(),
//     firstName: Joi.string().required(),
//     surname: Joi.string().required(),
//     email: Joi.string().email().required(),
//     roomId: Joi.number(),
//     checkInDate: Joi.date().iso().required(),
//     checkOutDate: Joi.date().iso().min(Joi.ref("checkInDate")).required(),
//   });
//   const { error, value } = schema.validate(request.body);
//   if (error) {
//     response.json(error.details[0].message)
//   } else {
//     const newBooking = {
//       id: bookings.length + 1,
//       title: value.title,
//       firstName: value.firstName,
//       surname: value.surname,
//       email: value.email,
//       roomId: value.roomId,
//       checkInDate: value.checkInDate,
//       checkOutDate: value.checkOutDate,
//     }
//     bookings.push(newBooking)
//     response.send(bookings);
//   }
// });

const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
