const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const moment = require("moment");
let bookings = require("./bookings.json");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// get all bookings
app.get("/bookings", (req, res) => {
  res.status(200);
  res.send(bookings);
});

// search by date
app.get("/bookings/search", (req, res, next) => {
  const { date } = req.query;

  if (date == null) {
    next();
    return;
  }

  const result = bookings.filter((booking) => {
    return moment(date).isBetween(booking.checkInDate, booking.checkOutDate);
  });

  res.send(result);
});

// search by term
app.get("/bookings/search", (req, res, next) => {
  const term = req.query.term?.toLowerCase(); // ?. - if term is nullish it returns undefined without causing an error

  if (term == null) {
    next();
    return;
  }

  const result = bookings.filter((booking) => {
    return (
      booking.firstName.toLowerCase().includes(term) ||
      booking.surname.toLowerCase().includes(term) ||
      booking.email.toLowerCase().includes(term)
    );
  });

  res.send(result);
});

// get one booking by id
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const foundBooking = bookings.find((booking) => {
    return booking.id === id;
    // returns element || undefined
  });

  foundBooking !== undefined
    ? res.status(200).send(foundBooking)
    : res.status(404).send(`There is no booking with id ${id}`);
});

// post a new booking
app.post("/bookings", (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(2).required(),
    firstName: Joi.string().max(50).required(),
    surname: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    roomId: Joi.number().integer().min(1).required(),
    checkInDate: Joi.date().iso().required(),
    checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).required(),
  });

  const result = schema.validate(req.body);

  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  const id = bookings[bookings.length - 1].id + 1; // id for the new booking
  const newBooking = {
    id,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    bookings.push(newBooking);
    res.status(200).send(bookings);
  }
});

// delete a booking by id
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookingToDelete = bookings.findIndex((booking) => {
    return booking.id === id;
    // returns index of the booking || -1
  });

  if (bookingToDelete !== -1) {
    bookings.splice(bookingToDelete, 1);
    res.status(200).send("Deleted");
  } else {
    res.status(404).send("Not found");
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
