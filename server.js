const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");

// validator.validate("test@email.com");
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// Search booking by date
app.get("/bookings/search", function (request, response) {
  const date = new Date (request.query.date)
  const matchingBookings = bookings.filter(booking => 
    moment(`${date}`).isBetween(`${booking.checkInDate}`, `${booking.checkOutDate}`)
  );
  if(matchingBookings.length === 0){
    return response
      .status(400)
      .send(
        `Msg: There is no matching booking on the selected date : ${request.query.date}`
      );
  }
  response.send(matchingBookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:bookingId", function (request, response) {
  const bookingId = +request.params.bookingId;
  const selectedBooking = bookings.filter(
    booking => booking.id === bookingId 
    );
  console.log(`Request to get booking id:${bookingId}`);
  response.send(selectedBooking);
});

// Create a new message
app.post("/bookings", (request, response) => {
  const { title, firstName, surname, roomId, email, checkInDate, checkOutDate } = request.body;
  if (!title || !firstName || !surname || !roomId || !checkInDate || !checkOutDate ) {
    return response.status(400).send({ MSG: `Missing information` });
  }
  if(!validator.validate(email)){
    return response.status(400).send({ msg: 'invalid email address' });
  }
  if((new Date (checkOutDate)) < (new Date (checkInDate))){
    response.status(400).send({ MSG: `Check in date can not be after check out date` });
  }
  const newBookings = {
    id: bookings[bookings.length - 1].id + 1,
   ...request.body,
  };
  bookings.push(newBookings);
  response.send(newBookings);
});

// Delete a booking
app.delete("/bookings/:bookingId", (request, response) => {
  const bookingId = +request.params.bookingId;
  const index = bookings.findIndex(
    booking => booking.id === bookingId
    );
    if (index === -1) {
      return response.status(400).send({ MSG: `Check id` });
    }
    bookings.splice(index, 1);
    response.send(`Msg: booking id:${bookingId} deleted`);
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
