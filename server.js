const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
//read all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
  console.log("all booking");
});

//create new booking
app.post("/bookings", (request, response) => {
  //get data from the client
  const booking = request.body;

   if (
     !booking.title ||
     !booking.firstName ||
     !booking.surname ||
     !booking.email ||
     !booking.roomId ||
     !booking.checkInDate ||
     !booking.checkOutDate
   ) {
     response.status(400).send("Please fill the text");
     return;
   }

  const newBooking = {
    id: bookings[bookings.length -1].id + 1,
    title: booking.title,
    firstName: booking.firstName,
    surname: booking.surname,
    email: booking.email,
    roomId: booking.roomId,
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
  };

  if (booking) {
    bookings.push(newBooking);
    response.status(201).send(newBooking);
  } 
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  const filterBooking = bookings.filter(
    (booking) => booking.id === Number(request.params.id)
  );

   if (filterBooking.length === 0) {
     response.status(404).send("Booking cannot be found!:{");
     return;
   }
  response.send(filterBooking);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  const index = bookings.findIndex(
    (booking) => booking.id === Number(request.params.id)
  );

  if (index === -1) {
    response.status(404).send("Booking for deletion cannot be found!:{");
    return;
  }

  bookings.splice(index, 1);
console.log(index);
  response.send("Successfully Deleted!!!");
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
