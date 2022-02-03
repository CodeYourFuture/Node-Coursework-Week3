const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
})

app.get("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(booking => booking.id === bookingId);
  if(booking) {
    res.status(200).send(booking);
  } else {
    res.status(404).send({message: "User not found"});
  }
})

app.delete("/bookings/:id", (req, res) => {
 const bookingId = parseInt(req.params.id);
 let bookingIndex = bookings.findIndex(booking => booking.Id === bookingId);
 if(bookingIndex < 0) {
   res.status(404).json({ message: "No Booking was found with this id"})
 } else {
  bookings.splice(bookingIndex, 1);
  res.status(200).json({ message: "Booking was deleted"});
 }
 
})


app.post('/bookings', (req, res) => {
  const newBooking = {
    id: bookings.length+1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  }
if(
    newBooking.title &&
    newBooking.firstName &&
    newBooking.surname &&
    newBooking.email &&
    newBooking.roomId &&
    newBooking.checkInDate &&
    newBooking.checkOutDate
  ) {
    bookings.push(newBooking);
    res.status(200).json({ message: "The new booking is added successfully" });
  } else {
    res.status(404).json({
      message: "Title, FirstName, Surname, Email, RoomId, CheckInDate and CheckOutDate is required",
    });
  }
})


const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
