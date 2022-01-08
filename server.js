const express = require("express");
const cors = require("cors");
const moment = require("moment");
var validator = require("email-validator");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const req = require("express/lib/request");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", function (request, response) {
  response.send(bookings);
});

app.get("/bookings/search", function (request, response) {
  if (request.query.date) {
    const searchByDate = bookings.filter((item) => {
      return moment(request.query.date).isBetween(
        item.checkInDate,
        item.checkOutDate
      );
    });
    response.send(searchByDate);
  } else {
    const searchByTerm = bookings.filter((item) => {
      return (
        item.email.includes(request.query.term) ||
        item.firstName.includes(request.query.term) ||
        item.surname.includes(request.query.term)
      );
    });
    response.send(searchByTerm);
  }
});

app.get("/bookings/:id", function (request, response) {
  const filterById = bookings.filter((item) => item.id == request.params.id);
  if (filterById.length > 0) {
    response.send(filterById);
  } else {
    response.status(404).send("Not found");
  }
});

app.delete("/bookings/:id", function (request, response) {
  const bookingById = bookings.find((item) => item.id == request.params.id);
  if (bookingById) {
    response.send(bookings.splice(bookings.indexOf(bookingById), 1));
  } else {
    response.status(404).send("Not found.");
  }
});

app.post("/bookings", function (request, response) {
  console.log(validator.validate(request.body.email));
  let dateValidation =
    moment(request.body.checkInDate) < moment(request.body.checkOutDate);
  let emailValidation = validator.validate(request.body.email);
  let dataValidation = Object.values(request.body).includes("");

  if (!dateValidation || !emailValidation || dataValidation) {
    return response
      .status(400)
      .send(
        `Please ${
          !dateValidation
            ? "validate date"
            : !emailValidation
            ? "validate email"
            : "fill in all parts."
        }`
      );
  }
  bookings.push(Object.assign({ id: bookings.length + 1 }, request.body));
  response.send("You booking has been processed.");
});

const listener = app.listen(process.env.PORT || 4000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

