const express = require("express");
const cors = require("cors");
var validator = require("email-validator");
var moment = require("moment");
const app = express();

const port = process.env.PORT || 3005;
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request } = require("express");

// read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// create a new booking

app.post("/bookings", (request, response) => {
  let indexOfLastBooking = bookings.length - 1;
  console.log(indexOfLastBooking);
  let bookingsId = [];
  for (let i = 0; i < bookings.length; i++) {
    bookingsId.push(bookings[i].roomId);
  }
  console.log(bookingsId);
  let newBooking = {
    id: bookings[indexOfLastBooking].id + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  if (!newBooking.title || newBooking.title.length === 1) {
    response.status(400).json({ message: "Please enter a valid title" });
  } else if (!newBooking.firstName || newBooking.firstName.length < 3) {
    response.status(400).json({ message: "Please enter a valid first name" });
  } else if (!newBooking.surname || newBooking.surname.length < 3) {
    response.status(400).json({ message: "Please enter a valid surname" });
  } else if (validator.validate(newBooking.email) === false) {
    response.status(400).json({ message: "Please enter a valid email" });
  } else if (bookingsId.includes(newBooking.roomId)) {
    response
      .status(400)
      .json({ message: "Room is taken, please enter another roomId" });
  } else if (
    newBooking.checkInDate !=
    moment(newBooking.checkInDate).format("YYYY-MM-DD")
  ) {
    response.status(400).json({ message: "Please enter a valid date" });
  } else if (
    newBooking.checkOutDate !=
    moment(newBooking.checkOutDate).format("YYYY-MM-DD")
  ) {
    response.status(400).json({ message: "Please enter a valid date" });
  } else if (
    moment(newBooking.checkOutDate).isBefore(moment(newBooking.checkInDate))
  ) {
    response.status(400).json({ message: "Please enter a valid date" });
  } else {
    response.json(bookings.push(newBooking));
  }
});

// search terms by date or email/names
app.get("/bookings/search", (request, response) => {
  // let checkedDate = request.query.date;
  // let foudDate = bookings.filter((date) => date.checkInDate === checkedDate);
  // if (foudDate) {
  //   response.json(foudDate);
  // } else {
  //   response.status(400).json({ message: "not found" });
  // }

  let term = request.query.term;
  let foundPerson = bookings.filter((p) =>
    (p.firstName + p.surname + p.email)
      .toLowerCase()
      .includes(term.toLowerCase())
  );
  console.log(foundPerson);
  if (foundPerson) {
    response.json(foundPerson);
  } else {
    response.json({ message: "Not Found" });
  }
});
// get a booking specified by id.

app.get("/bookings/:id", (request, response) => {
  let id = Number(request.params.id);
  let person = bookings.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ message: "There is no one with such id" });
  }
});

// delete a booking with a specific id
app.delete("/bookings/:id", (request, response) => {
  let id = Number(request.params.id);
  let personIndex = bookings.findIndex((person) => person.id === id);
  if (personIndex > -1) {
    bookings.splice(personIndex, 1);
    response.json(bookings);
  } else {
    response.status(404).json({ message: "There is no one with such id" });
  }
});
// TODO add your routes and helper functions here

app.listener = app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});
