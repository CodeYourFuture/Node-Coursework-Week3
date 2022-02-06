const express = require("express");
const cors = require("cors");
const lodash = require("lodash");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

const validator = require("email-validator");

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.post("/bookings", function (request, response) {
  const { roomId, title, firstName, surName, email, checkInDate, checkOutDate } = request.body;
  const newBooking = {
    // ...request.body,
    id: bookings[bookings.length - 1].id + 1,
    title,
    firstName,
    surName,
    email,
    roomId,
    checkInDate,
    checkOutDate
  }
  if (
    !firstName ||
    !title ||
    !surName ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate ||
    !moment(checkOutDate).isSameOrAfter(checkInDate) ||
    !validator.validate(email)
  ) {
    response.status(404).send(request.body);
  } else {
    //   // I had help with getting the id automatically generated
    bookings.push(newBooking);
    response.status(200).json(bookings);
  }
});

app.get("/bookings", function (_, response) {
  response.send(bookings);
});

app.get('/bookings/:id', (req, res) => {
  const bookingById = bookings.filter(booking => booking.id === Number(req.params.id));

  if (bookingById.length > 0) {
    res.status(200).send(...bookingById)
  } else {
    res.status(404).send('The is no booking with that ID');
  }
})

app.delete('/bookings/:id', (req, res) => {
  const bookingToDelete = bookings.find(booking => booking.id === Number(req.params.id));
  if (bookingToDelete) {
    bookings.splice(req.params.id, 1);
    bookings.map((booking, index) => booking.id = index + 1);
    res.status(200).send('Booking Deleted');
  } else {
    res.status(404).send('There is no booking with that ID');
  }
});

// app.delete("/bookings/:id", function (request, response) {
//   let booking_to_delete;
//   for (let i = 0; i < bookings.length; i++) {
//     if (bookings[i].id == request.params.id) {
//       booking_to_delete = bookings[i];
//       bookings.splice(i, 1);
//     }
//   }
//   // I needed help for the next line
//   if (booking_to_delete) {
//     response.send(booking_to_delete);
//   } else {
//     response.status(404).send(request.params.id);
//   }
// });

// // I had help on L3
// app.get("/bookings/search", function (request, response) {
//   // I had help to get two search options into this route
//   if (request.query.date) {
//     let bookingsInDateRange = [];
//     let date = request.query.date;

//     for (let bookingIndex in bookings) {
//       let booking = bookings[bookingIndex];
//       let checkInDate = booking["checkInDate"];
//       let checkOutDate = booking["checkOutDate"];
//       if (
//         moment(date).isSameOrAfter(checkInDate) &&
//         moment(date).isSameOrBefore(checkOutDate)
//       ) {
//         bookingsInDateRange.push(booking);
//       }
//     }
//     response.send(bookingsInDateRange);
//   } else if (request.query.term) {
//     let term = request.query.term;
//     term = term.toLowerCase();
//     let foundBookings = searchBooking(term);
//     response.send(foundBookings);
//   }
// });

// const searchBooking = (term) => {
//   let searchedArrayOfBookings = [];
//   for (let booking of bookings) {
//     const emailLowered = booking.email.toLowerCase();
//     const firstNameLowered = booking.firstName.toLowerCase();
//     const surnameLowered = booking.surname.toLowerCase();
//     if (
//       emailLowered.includes(term) ||
//       firstNameLowered.includes(term) ||
//       surnameLowered.includes(term)
//     ) {
//       searchedArrayOfBookings.push(booking);
//     }
//   }
//   return searchedArrayOfBookings;
// };

app.get("/bookings/:id", function (request, response) {
  let booking = bookings.find((booking) => booking.id == request.params.id);
  if (booking) {
    response.send(booking);
  } else {
    response.status(404).send(request.params.id);
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});