const express = require("express");
const cors = require("cors");
// first install moment npm i moment
const moment = require("moment");

//first install the email-validator npm i email-validator
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// port Number
const portNumber = process.env.PORT || 5000;

// generate id
//const uuid = require('uuid');

//id Number
let idBooking = bookings.length + 1;
// Level 1- create a new booking
app.post("/booking", (request, response) => {
  const newBooking = {
    id: idBooking,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: parseInt(request.body.roomId),
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
    timeSent: new Date().toLocaleDateString(),
  };
  ///Level 2 - simple validation
  // create a validation to make sure all the filled are filled
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response
      .status(404)
      .json({ message: "Please make sure you had enter all information" });
    //Level 4 - validation to check on whether the checkInDate is less than the checkOutDate--- checkoutDate is not after checkinDate
  } else if (
    moment(request.body.checkInDate) > moment(request.body.checkOutDate)
  ) {
    response.status(404).json({
      message:
        "The check-in-date can not exceed or be equals to the check-out data",
    });
    //Level 4 -validation to check if the email entered is in a correct format
  } else if (!validator.validate(request.body.email)) {
    response.status(404).json({
      message: `The entered email ${request.body.email} is not in the correct format. please enter the correct email. eg- example@gmail.com`,
    });
  }
  // if all the validations are passing test them create the new booking
  else {
    bookings.push(newBooking); // if all information are enter, create a new booking
    response.status(200).json(newBooking); // print the new booking
  }
});

// Level 1- read all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

// Level 1- read one bookings, specified by an ID
app.get("/bookings/:searchId", (request, response) => {
  //return a booleans expression on whether the request params id (value the used would enter) is equal to the id in the booking array
  const foundTheId = bookings.some(
    (booking) => booking.id === parseInt(request.params.searchId)
  );

  // if the boolean generate to true filter that id else alert a message to the user that the id could not be found
  if (foundTheId) {
    const filterId = bookings.filter(
      (booking) => booking.id === parseInt(request.params.searchId)
    );
    response.status(200).json(filterId);
  } else {
    response.status(404).json({
      message: `No booking with the id ${request.params.searchId} could be found`,
    });
  }
});

// update
app.put("booking/:id", (req, res) => {
  // check if the id exist
  const found = bookings.some(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (found) {
    const updateBooking = req.body;
    bookings.forEach((booking) => {
      if (booking.id === parseInt(req.params.id)) {
        // since we want to update, let it have the value of what the user would enter
        booking.title = updateBooking.title
          ? updateBooking.title
          : booking.title;
        booking.firstName = updateBooking.firstName
          ? updateBooking.firstName
          : booking.firstName;
        booking.surname = updateBooking.surname
          ? updateBooking.surname
          : booking.surname;
        booking.email = updateBooking.email
          ? updateBooking.email
          : booking.email;
        booking.roomId = updateBooking.roomId
          ? updateBooking.roomId
          : booking.roomId;
        booking.checkInDate = updateBooking.checkInDate
          ? updateBooking.checkInDate
          : booking.checkInDate;
        booking.checkOutDate = updateBooking.checkOutDate
          ? updateBooking.checkOutDate
          : booking.checkOutDate;

        res.json({ message: `booking updated`,booking});
      }
    });
    // res.json(
    //   bookings.filter((booking) => booking.id === parseInt(req.params.id))
    // );
  } else {
    res
      .status(404)
      .json({ message: `No booking with the Id of ${req.params.id}` });
  }
});

// Level 1- Delete a booking, specified by an ID
app.delete("/booking/:deleteId", (request, response) => {
  //return a booleans expression on whether the request params id (value the used would enter) is equal to the id in the booking array
  const foundTheId = bookings.some(
    (booking) => booking.id === parseInt(request.params.deleteId)
  );

  // if the boolean generate to true filter that id else alert a message to the user that the id could not be found
  // In the case the bookind.id must not equal to the request parameter id
  if (foundTheId) {
    const filterId = bookings.filter(
      (booking) => booking.id !== parseInt(request.params.deleteId)
    );
    response.status(200).json({
      message: `The booking with the id ${request.params.deleteId} has successfully been deleted`,
      Bookings: filterId,
    });
  } else {
    response.status(404).json({
      message: `No booking with the id ${request.params.deleteId} could be found`,
    });
  }
});

//Level 3 search booking by date
app.get("/bookings/search", (request, response) => {
  const { date } = request.query;
  const checkMatch = bookings.some(
    (booking) => booking.checkInDate === date || booking.checkOutDate === date
  );
  //date
  if (checkMatch) {
    const foundMatching = bookings.filter((booking) => {
      return (
        booking.checkInDate.includes(checkMatch) ||
        booking.checkOutDate.includes(checkMatch)
      );
    });
    response.send(foundMatching);
  } else {
    response.json({ messages: `No booking were made on this date--- ${date}` });
  }
});

//Level 5 --free-text search
app.get("/booking/search", (request, response) => {
  const { term } = request.query;
  const checkMatch = bookings.find(
    (booking) =>
      booking.email.toLowerCase() === term ||
      booking.firstName.toLowerCase() === term ||
      booking.surname.toLowerCase() === term
  );
  if (checkMatch) {
    response.send(checkMatch);
  } else {
    response
      .status(404)
      .json({ message: `No booking can be found with the term ${term}` });
  }
});

app.listen(portNumber, function () {
  console.log("Your app is listening on port " + portNumber);
});
// const listener = app.listen(portNumber, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// Functionality
/*
Spoiler: Correct Routes

| method | example path                     | behaviour                                   |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | /bookings                        | return all bookings                         |
| GET    | /bookings/17                     | get one booking by id                       |
| GET    | /booking/searchTerm?term=jones      | get all bookings matching a search term     |
| POST   | /bookings                        | create a new booking                        |
| DELETE | /bookings/17                     | delete a booking by id                      |
| GET    | /bookings/search?date=2019-05-20 | return all bookings spanning the given date |
*/
