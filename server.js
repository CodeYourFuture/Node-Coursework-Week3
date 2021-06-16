const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const app = express();
app.use(express.json());
app.use(cors());

validator.validate("test@email.com"); // true

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
// const { response, request } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/search", function (request, response) {
  const searchRequestedDate = request.query.date;
  const searchRequestedTerm = request.query.term;
  if (searchRequestedTerm) {
    const foundBookings = bookings.filter((booking) => {
      return (
        booking.email
          .toUpperCase()
          .includes(searchRequestedTerm.toUpperCase()) ||
        booking.firstName
          .toUpperCase()
          .includes(searchRequestedTerm.toUpperCase()) ||
        booking.surname.toUpperCase().includes(searchRequestedTerm.toUpperCase())
      );
    });
    response.json(foundBookings);
  }
  if (searchRequestedDate) {
    const isQueryDateValid = moment(
      searchRequestedDate,
      "YYYY-MM-DD",
      true
    ).isValid();
    if (isQueryDateValid) {
      const matchedBookings = bookings.filter((booking) => {
        return moment(searchRequestedDate).isBetween(
          booking.checkInDate,
          booking.checkOutDate,
          null,
          "[]"
        );
      });

      response.json(matchedBookings);
    } else {
      response.status(404).send("Please enter date in YYYY-MM-DD format.");
    }
  } else {
    response.status(404).send("no date query");
  }
});
app.get("/bookings/:bookingId", function (request, response) {
  const requestedBooking = bookings.filter((booking) => {
    return booking.id === parseInt(request.params.bookingId);
  });
  if (requestedBooking.length === 0) {
    response
      .status(404)
      .send(`There is no booking with the id of ${request.params.bookingId}`);
  } else {
    response.json(requestedBooking);
  }
});

app.post("/bookings", function (request, response) {
  const data = request.body;
  console.log(data);

  const isEmailValid = validator.validate(data.email);
  const isPostBodyDataValid = validatePostBody(data);
  const isCheckoutDateLaterThanCheckinDate = moment(data.checkInDate).isBefore(
    data.checkOutDate
  );
  if (!isEmailValid) {
    response.status(400).send("error please check the email");
  } else if (!isCheckoutDateLaterThanCheckinDate) {
    response.status(400).send("error check-out date is before check-in date");
  }  else if (isPostBodyDataValid) {
    console.log("still adding")
    const newBooking = {
      id: data.id,
      title: data.title,
      firstName: data.firstName,
      surname: data.surname,
      email: data.email,
      roomId: data.roomId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    };
    bookings.push(newBooking);
    response.status(200).json(newBooking);
  } else {
    response.status(400).send("error-please check the data you sent");
  }

  function validatePostBody(data) {
    let dataType = {
      id: "",
      title: "",
      firstName: "",
      surname: "",
      email: "",
      roomId: "",
      checkInDate: "",
      checkOutDate: "",
    };
    let isMissingProperty = true;
    for (const property in dataType) {
      if (!data.hasOwnProperty(property)) {
        isMissingProperty = false;
      }
    }

    let isDataAccurate = true;
    for (const property in data) {
      if (data[property] === "") {
        isDataAccurate = false;
      }
    }

    return isMissingProperty && isDataAccurate;
  }
});

app.delete("/bookings/:bookingId", function (request, response) {
  console.log("delete path called")
  const previousLengthOfBookings = bookings.length;
  bookings = bookings.filter((booking) => {
    return booking.id != request.params.bookingId;
  });
  if (previousLengthOfBookings === bookings.length) {
    response
      .status(404)
      .send(
        `There is no id of ${request.params.bookingId}, please check the id`
      );
  } else {
    response.json(bookings);
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(3011, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
