const express = require("express");
const app = express();
const cors = require("cors");
const moment = require("moment");
const port = 5039;
const bodyParser = require("body-parser");
const fs = require("fs");
var validator = require("email-validator");
const uuid = require("uuid");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const bookings = require("./bookings.json");
const { emitKeypressEvents } = require("readline");
//Use this array as your (in-memory) data store.

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/search", function (request, response) {
  const date = moment(request.query.date, "YYYY-MM-DD");
  const term = request.query.term;
  console.log(date);
  console.log(term == undefined);
  console.log(Object.keys(request.query).length == 0);

  if (term == undefined && !date.isValid()) {
    response.status(400).send("Search a term or date");
    return;
  }

  if (term == undefined && !date.isValid() && isNaN(date) === true) {
    response.status(400).send("Please change the date format(YYYY-MM-DD).");
    return;
  }

  let newArray = bookings;

  newArray = newArray.filter((bks) => {
    const checkIn = moment(bks.checkInDate, "YYYY-MM-DD");
    const checkOut = moment(bks.checkOutDate, "YYYY-MM-DD");

    if (date.isValid()) {
      if (checkOut.isSame(date)) {
        return checkOut.isSame(date);
      }
      if (checkIn.isSame(date)) {
        return checkIn.isSame(date);
      }
    }

    if (term != undefined) {
      if (bks.firstName.toLowerCase().includes(term.toLowerCase())) {
        bks.firstName.toLowerCase().includes(term.toLowerCase());
      }

      if (bks.email.includes(term)) {
        return bks.email.includes(term);
      }
    }
  });

  console.log(newArray);
  response.json(newArray);
});

app.get("/bookings/:id", function (request, response) {
  let bookingID = request.params.id;

  let filteredIdBooking = bookings.filter(
    (bks) => bks.id === parseInt(bookingID)
  );
  response.json(filteredIdBooking);
});

app.post("/bookings", function (request, response) {
  for (const key in request.body) {
    if (validator.validate(request.body[key].email) === false) {
      response.status(404).send("Your email is not valid.");
      return;
    }

    if (!request.body[key] && key !== "id") {
      res.status(400).send("Please enter all fields");
    }

    if (
      moment(request.body[key].checkInDate) >
      moment(request.body[key].checkOutDate)
    ) {
      response.status(400).send("Enter a valid dates");
    }

    const fields = {
      id: uuid.v4(),
      title: request.body[key].title,
      firstName: request.body[key].firstName,
      surname: request.body[key].surname,
      email: request.body[key].email,
      roomId: request.body[key].roomId,
      checkInDate: request.body[key].checkInDate,
      checkOutDate: request.body[key].checkOutDate,
    };

    bookings.push(fields);
    response.json(bookings);
  }
});

app.delete("/bookings/:id", function (request, response) {
  const bookingID = parseInt(request.params.id);
  if (isNaN(bookingID)) {
    res.sendStatus(400);
    return;
  }
  const filteredIdBooking = bookings.filter(
    (bks) => bks.id === parseInt(bookingID)
  );
  if (!filteredIdBooking) {
    res.sendStatus(404);
    return;
  }
  const index = bookings.findIndex((a) => a.bookingID === bookingID);
  bookings.splice(index, 1);
  response.json(filteredIdBooking);
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
