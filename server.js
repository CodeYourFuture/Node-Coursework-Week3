const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read All booking
app.get("/bookings", (request, response) => {
  response.json(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id([0-9]+)", (request, response) => {
  const { id } = request.params;
  const booking = bookings.find((element) => element.id === parseInt(id));
  if (booking) {
    response.json(booking);
  } else {
    response.status(404).send("Please enter a valid id ");
  }
});

//Create a new booking
app.post("/bookings", (request, response) => {
  const schema = Joi.object({
    id: Joi.required(),
    title: Joi.string().min(2).required(),
    firstName: Joi.string().min(3).required(),
    surname: Joi.string().min(3).required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    roomId: Joi.number().required(),
    checkInDate: Joi.date().raw().required(),
    checkOutDate: Joi.date().raw().required(),
  });
  const booking = request.body;
  booking.id = bookings.length + 1;
  console.log(booking)
  const result = schema.validate(request.body);
  if (result.error) {
    response.status(400).send(result.error.details[0].message);
    return;
  } else {
    bookings.push(result);
    response.send(bookings);
  }
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id([0-9]+)", (request, response) => {
  const id = Number(request.params.id);
console.log(id)
  const bookingToDelete = bookings.findIndex((booking) => {
    return booking.id === id;
  });
  if (bookingToDelete !== -1) {
    bookings.splice(bookingToDelete, 1);
    response.status(200).send(`You deleted the message with id, ${id}`);
  } else {
    return response.status(404).send("message with given id was not found");
  }
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
