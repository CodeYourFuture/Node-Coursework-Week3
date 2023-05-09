const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
// Read all bookings
app.get("/", function (request, response) {
  response.send({bookings});

  // { bookings: [....]}
});

// TODO add your routes and helper functions here

// Read one booking, specified by an ID
app.get("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  const findId = bookings.find(booking => booking.id === Number(bookingId))
  if(findId){
     response.send(findId)
     console.log(findId)
  }else{
    response.status(404).send("message not found");
  }
});


// Create a new booking with Level 4 (Optional, advanced) - advanced validation
app.post("/booking", function (request, response) {
  const id = bookings.length + 1;
  const {
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  } = request.body;

  let newBooking = {
    id,
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  };

   // Validating required fields
  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    response.status(400).send("Please fill in all required information.");
    return;
  }

  // Validating email address
  if (!validator.isEmail(email)) {
    response.status(400).send("Invalid email address.");
    return;
  }

  // Validating check-in and check-out dates
  const checkInMoment = moment(checkInDate, "YYYY-MM-DD");
  const checkOutMoment = moment(checkOutDate, "YYYY-MM-DD");

  if (!checkInMoment.isValid() || !checkOutMoment.isValid()) {
    response.status(400).send("Invalid date format.");
    return;
  }

  if (!checkOutMoment.isAfter(checkInMoment)) {
    response.status(400).send("Check-out date must be after check-in date.");
    return;
  }

  bookings.push(newBooking);
  response.status(201).send({ newBooking });
});

// Level 3 (Optional, advanced) - search by date
app.get("/bookings/date/search", function(request, response) {
  const date = request.query.date;

  if (moment(date, "YYYY-MM-DD").isValid()){
    const searchResult = bookings.filter((booking) => {
      moment(booking.checkInDate).isAfter(date) &&
      moment(booking.checkOutDate).isSameOrAfter(date) 
    })
    response.status(200).send({searchResult});
  } else {
    response.status(400).send("Invalid date format.");
  }
});

// # Level 5 (Optional, easy) - free-text search
// Search for bookings which match a given search term
app.get("/bookings/term/search", function(request, response) {
  const term = request.query.term;

  if (!term) {
    response.status(400).send("Search term is missing.");
    return;
  }

  const searchResult = bookings.filter((booking) => {
    const { email, firstName, surname } = booking;
    return (
      email.toLowerCase().includes(term.toLowerCase()) ||
      firstName.toLowerCase().includes(term.toLowerCase()) ||
      surname.toLowerCase().includes(term.toLowerCase())
    );
  });

  response.status(200).send({ searchResult });
});



//Delete a booking, specified by an ID
app.delete("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  const findIndex = bookings.findIndex((booking) => booking.id === Number(bookingId));
  const removedBooking = bookings[findIndex];
  if (findIndex !== -1) {
    bookings.splice(findIndex,1);
    response.status(200).send({removedBooking});
  } else {
    response.status(404).send("message not found");
  }
});


const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
