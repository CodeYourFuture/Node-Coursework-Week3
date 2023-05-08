const express = require("express");
const cors = require("cors");
const validator = require ("email-validator");
const moment = require ("moment");

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// Creating New Bookings
app.post("/bookings", function(request, response) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } =request.body;

  const newBooking = {
    id:bookings.length +1,
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
      message: "All sections need to be filled, including valid Email address",
    });
  }
  
  if (!validator.validate(newBooking.email)){
    return response.status(400).json({ message: "A valid email address is required"});
  }

  if (moment(newBooking.checkOutDate, "YYYY-MM-DD").isBefore(newBooking.checkInDate, "YYYY-MM-DD" )) {
    return response.status(400).json({ message : "Check Out date should be after Check In Date." });
  }

  bookings.push(newBooking);
  response.status(201).json({message: "New Booking added", bookings});
});

// Getting bookings with search terms and date

app.get("/bookings/search", function (request, response) {
  const searchWord = request.query.term || "";

  let filterTerms = bookings.filter((everyBooking) => 
  everyBooking.firstName.toLowerCase().includes(searchWord.toLowerCase()) || everyBooking.surname.toLowerCase().includes(searchWord.toLowerCase()) || everyBooking.email.toLowerCase().includes(searchWord.toLowerCase())
  );

  const searchByDate = request.query.date && moment(request.query.date, "YYYY-MM-DD");

  if(searchByDate) {
    if (!searchByDate.isValid()) {
      return response.status(400).json({message: "Please enter a valid date"});
    }

    filterTerms = filterTerms.filter((eachBooking) =>
    searchByDate.isBetween(
      eachBooking.checkInDate, eachBooking.checkOutDate, undefined, "[]"
    ));
  }

  response.json(filterTerms);
});

// Bookings by Id

app.get("/bookings/:id", function (request, response) {
  const findBooking = bookings.find(
    (everyBooking)=> everyBooking.id === parseInt(request.params.id)
  );
  findBooking ? response.json(findBooking) : response.status(400).json({message: `Guest booking ${request.params.id} not found `});
});

// Delete Booking

app.delete("/bookings/:id", function (request, response) {
  const findBooking = bookings.find((eachBooking) =>eachBooking.id === parseInt(request.params.id));
  if(findBooking) {
    response.json({message: `Guest booking ${request.params.id} is now deleted`, guestLeft: bookings.filter((eachBooking)=> eachBooking.id !==parseInt(request.params.id)), });
  } else {
    response.status(404).json({message: `Guest booking ${request.params.id} not found`});
  }
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
