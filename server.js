import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";
import { validate } from "email-validator";
import moment from "moment";

const port = process.env.PORT || 3003;

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

//Use this array as your (in-memory) data store.
import bookings, { length, push, filter, find } from "./bookings.json";

// const allBookings = [bookings];

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// READ ALL BOOKINGS
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// CREATE NEW BOOKINGS
app.post("/bookings", function (request, response) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;

  const newBooking = {
    id: length + 1,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).json({
      message: "Please fill in all required sections and enter valid email",
    });
  }

  if (!validate(newBooking.email)) {
    return response.status(400).json({ message: "Please enter valid email" });
  }

  if (
    moment(newBooking.checkOutDate, "YYYY-MM-DD").isBefore(
      newBooking.checkInDate,
      "YYYY-MM-DD"
    )
  ) {
    return response
      .status(400)
      .json({ message: "Check Out Date has to be after Check In Date" });
  }

  push(newBooking);
  response.status(201).json({ message: "New Booking added", bookings });
});

// GET BOOKINGS BY SEARCH TERM AND DATE
app.get("/bookings/search", function (request, response) {
  const searchTerm = request.query.term || "";

  let filteredTerms = filter(
    (eachBooking) =>
      eachBooking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eachBooking.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eachBooking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchDate =
    request.query.date && moment(request.query.date, "YYYY-MM-DD");

  if (searchDate) {
    if (!searchDate.isValid()) {
      return response
        .status(400)
        .json({ message: "Please enter a valid date" });
    }

    filteredTerms = filteredTerms.filter((eachBooking) =>
      searchDate.isBetween(
        eachBooking.checkInDate,
        eachBooking.checkOutDate,
        undefined,
        "[]"
      )
    );
  }

  response.json(filteredTerms);
});

// FIND BOOKING BY ID
app.get("/bookings/:id", function (request, response) {
  const foundBooking = find(
    (eachBooking) => eachBooking.id === parseInt(request.params.id)
  );
  foundBooking
    ? response.json(foundBooking)
    : response
        .status(404)
        .json({ message: `Customer ${request.params.id} not found` });
});

// DELETE BOOKINGS
app.delete("/bookings/:id", function (request, response) {
  const foundBooking = find(
    (eachBooking) => eachBooking.id === parseInt(request.params.id)
  );
  if (foundBooking) {
    response.json({
      message: `Customer ${request.params.id} deleted`,
      customersRemaining: filter(
        (eachBooking) => eachBooking.id !== parseInt(request.params.id)
      ),
    });
  } else {
    response
      .status(404)
      .json({ message: `Customer ${request.params.id} not found` });
  }
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
