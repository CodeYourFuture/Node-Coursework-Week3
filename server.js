const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validEmail = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as the (in-memory) data store.
const bookings = require("./bookings.json");

let idCounter = 100; // Generate a unique ID

app.get("/", function (request, response) {
  // response.send("Hotel Booking Server.  Ask for /bookings, etc.");
  response.json({
    success: "Server Loaded",
    message: "Hotel Booking Server.  Ask for /bookings, etc.",
  });
});

// GET	/bookings	return all bookings
app.get("/bookings", (request, response) => {
  response.status(200).send(bookings);
});

// GET /bookings/search?term=frank	get all bookings matching a search term

app.get("/bookings/search", function (request, response) {
  if ("query" in request && "term" in request.query) {
    const searchTerm = request.query.term.toLowerCase();
    const results = bookings.filter(
      ({ firstName, surname, email }) =>
        firstName.toLowerCase().includes(searchTerm) ||
        surname.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm)
    );
    response.status(200).send(results);
    return;
  }

  // GET /bookings/search?date=2018-02-20 search by date

  if ("query" in request && "date" in request.query) {
    const searchDate = request.query.date;
    let validDate = moment(searchDate, "YYYY-MM-DD", true).format();
    if (validDate === "Invalid date")
      return response.status(400).json({
        errormessage: `Error: The Search Date '${searchDate}' is an Invalid Date. Ought to be YYYY-MM-DD format`,
      });

    const results = bookings.filter(
      ({ checkInDate, checkOutDate }) =>
        searchDate >= checkInDate && searchDate <= checkOutDate
    );
    response.status(200).send(results);
  }

  // OTHERWISE ERRONEOUS SEARCH REQUEST

  return response
    .status(400)
    .json({ errormessage: `Error: Invalid Search Request` });
});

/*
GET	/bookings/17	get one booking by id
*/

app.get("/bookings/:id", (request, response) => {
  let numId = Number(request.params.id);
  if (Number.isNaN(numId) || !Number.isSafeInteger(numId) || numId <= 0) {
    return response
      .status(400)
      .json({
        errormessage: `'${request.params.id}' has been rejected because an ID must be a positive nonzero integer`,
      });
  }

  let theBookingIndex = bookings.findIndex(({ id }) => id === numId);
  if (theBookingIndex < 0) {
    return response
      .status(404)
      .json({
        errormessage: `No booking with the ID '${request.params.id}' exists`,
      });
  }
  response.status(200).json(bookings[theBookingIndex]);
});

// POST - Create a new booking

app.post("/bookings", (request, response) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body; // Destructuring

  if (
    !title | !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return response.status(400).json({
      errormessage:
        `Error: Missing Field! Full name, room ID, email and dates are all mandatory fields. Ensure that none are blank` +
        ` and that Room Id is not zero.`,
    });
  }

  let validDate = moment(checkInDate, "YYYY-MM-DD", true).format();
  if (validDate === "Invalid date")
    return response.status(400).json({
      errormessage: `Error: The Check In Date '${checkInDate}' is an Invalid Date. Ought to be YYYY-MM-DD format`,
    });
  validDate = moment(checkOutDate, "YYYY-MM-DD", true).format();
  if (validDate === "Invalid date")
    return response.status(400).json({
      errormessage: `Error: The Check Out Date '${checkOutDate}' is an Invalid Date. Ought to be YYYY-MM-DD format`,
    });

  let numId = Number(roomId);
  if (Number.isNaN(numId) || !Number.isSafeInteger(numId) || numId <= 0)
    return response.status(400).json({
      errormessage: `The Room ID '${roomId}' has been rejected because it must be a positive nonzero integer`,
    });
  if (checkOutDate <= checkInDate)
    return response.status(400).json({
      errormessage: `The Checkout Date '${checkOutDate}' is not after the Checkin Date '${checkInDate}'`,
    });

  if (!validEmail.validate(email))
    return response
      .status(400)
      .json({ errormessage: `The Email Address '${email}' is not valid` });

  bookings.push({
    id: idCounter++,
    title: title,
    firstName: firstName,
    surname: surname,
    roomId: roomId,
    email: email,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  });
  // Return the one that had just been created
  response
    .status(200)
    .json({ success: "Booking Created", Booking: bookings.slice(-1) });
});

// DELETE - Delete a booking, specified by an ID

app.delete("/bookings/:id", (request, response) => {
  let numId = Number(request.params.id);
  if (Number.isNaN(numId) || !Number.isSafeInteger(numId) || numId <= 0) {
    return response.status(400).json({
      errormessage: `'${request.params.id}' has been rejected because an ID must be a positive nonzero integer`,
    });
  }

  let theBookingIndex = bookings.findIndex(({ id }) => id === numId);
  if (theBookingIndex < 0) {
    return response.status(404).json({
      errormessage: `No booking with the ID '${request.params.id}' exists`,
    });
  }

  let removed = bookings[theBookingIndex];

  bookings.splice(theBookingIndex, 1); // The Booking has been removed IN PLACE!

  // Return the one that had just been deleted
  response.status(200).json({ success: "Booking Deleted", message: removed });
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
