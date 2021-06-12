const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();
const validator = require("email-validator")

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


// Read all bookings
app.get("/bookings", (request, response) => {
  response.json(bookings)
})


//  Search functionality
app.get("/bookings/search", (request, response) => {
  const { term, date } = request.query;

  //  Read only booking whose text contains a given substring:
  if (term) {
    const filteredBooking = bookings.filter(booking => booking.firstName.toUpperCase().includes(term.toUpperCase()) || booking.surname.toUpperCase().includes(term.toUpperCase()) || booking.email.toUpperCase().includes(term.toUpperCase()));

    if (filteredBooking.length > 0) {
      response.json(filteredBooking)
    } else {
      response.status(404).json({ message: `No booking found` })
    }
  }

  // Search for bookings which span a date (given by the client)
  if (date) {
    const filteredBookings = bookings.filter((entry) => entry.checkInDate.includes(date) || entry.checkOutDate.includes(date));

    if (filteredBookings.length > 0) {
      response.json(filteredBookings)
    } else {
      response.status(404).json({ message: `No booking found` })
    }
  }

})


// Read one booking specified by an ID
app.get("/bookings/:id", (request, response) => {
  const selectedId = request.params.id;
  const isBookingIdFound = bookings.some(booking => booking.id === parseInt(selectedId));

  if (isBookingIdFound) {
    response.json(bookings.filter(booking => booking.id === parseInt(selectedId)))
  } else {
    response.status(404).json({ message: `No booking with the id of ${selectedId}` })
  }
})


// Create a new booking
app.post("/bookings", (request, response) => {
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title.trim(),
    firstName: request.body.firstName.trim(),
    surname: request.body.surname.trim(),
    email: request.body.email.trim(),
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate.trim(),
    checkOutDate: request.body.checkOutDate.trim(),
    timeSent: new Date().toLocaleString() // store a timestamp in each booking object, in a field called timeSent.
  }

  const uniqueBookingIdCheck = bookings.some(booking => booking.id === request.body.id);

  if (uniqueBookingIdCheck) {
    return response.status(400).json({ message: "Booking Id is already created, please select another booking id" })
  }

  if (!newBooking.title || !newBooking.firstName || !newBooking.surname || !newBooking.email || !newBooking.roomId || !newBooking.checkInDate || !newBooking.checkOutDate) {
    return response.status(400).json({ message: "Please fill in all fields" })
  }
  
  // Email validation
  if(!validator.validate(request.body.email)) {
    return response.status(400).json({ message: "Please enter valid email" })
  }

  if (moment(request.body.checkInDate) > moment(request.body.checkOutDate)) {
    return response.status(400).json({ message: "Check-in date must be before than check-out date " })
  }

  bookings.push(newBooking);
  response.json(bookings)
})


// Update the selected booking
app.put("/bookings/:id", (request, response) => {
  const isBookingFound = bookings.some(booking => booking.id === parseInt(request.params.id));

  if (isBookingFound) {
    const updatedBooking = request.body;
    bookings.forEach(booking => {
      if (booking.id === parseInt(request.params.id)) {
        booking.title = updatedBooking.title ? updatedBooking.title : booking.title;
        booking.firstName = updatedBooking.firstName ? updatedBooking.firstName : booking.firstName;
        booking.surname = updatedBooking.surname ? updatedBooking.surname : booking.surname;
        booking.email = updatedBooking.email ? updatedBooking.email : booking.email;
        booking.roomId = updatedBooking.roomId ? updatedBooking.roomId : booking.roomId;
        booking.checkInDate = updatedBooking.checkInDate ? updatedBooking.checkInDate : booking.checkInDate;
        booking.checkOutDate = updatedBooking.checkOutDate ? updatedBooking.checkOutDate : booking.checkOutDate;
        booking.timeSent = booking.timeSent;
        response.json({ message: "Booking updated", booking })
      }
    })
  } else {
    response.status(400).json({ msg: `No booking with the id of ${request.params.id}` })
  }
})


// Delete a booking specified by an ID
app.delete("/bookings/:id", (request, response) => {
  let isBookingFound = bookings.some(booking => booking.id === parseInt(request.params.id));
  let deleteBooking;

  if (isBookingFound) {
    bookings.forEach((booking, index) => {
      if (booking.id === parseInt(request.params.id)) {
        deleteBooking = booking;
        bookings.splice(index, 1)
      }
    })
    response.json({ msg: `Booking Id ${request.params.id} deleted on ${new Date().toLocaleString()}`, deleteBooking })
  }
  else {
    response.status(404).json({ msg: `No booking with the id of ${request.params.id}` })
  }
})


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
