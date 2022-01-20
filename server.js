const express = require("express");
const cors = require("cors");
const app = express();
PORT = 3007;


//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));


//data
const bookings = require("./bookings.json");


//root directory
app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});


//all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//add new booking 
app.post("/bookings", function (req, res) {
  const newBooking = {
    id: bookings.length,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  //if these fields are empty..
  if (
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).json({ msg: "Please complete all required fields" });
  }

  //push new booking and send back bookings in response
  bookings.push(newBooking);
  res.status(200).json(bookings);

});


//search bookings by ID
app.get("/bookings/:id", (req, res) => {

  const foundBookings = bookings.filter(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (foundBookings.length > 0) {
    res.status(200).json(foundBookings);
  }

  res.status(404).json({ msg: `ID ${req.params.id} not found` });
});


//delete booking
app.delete("/bookings/:id", (req, res) => {

  const index = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (index < 0) {
    res.status(404).json({ msg: `Booking ${req.params.id} not found` });
  }

  bookings.splice(index, 1);
  res.status(200).json({ msg: `Booking ${req.params.id} was deleted` });
});


//listen 
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
