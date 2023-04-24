const express = require("express");
const cors = require("cors");
const moment = require("moment");
const emailValidator = require("email-validator");


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");


app.get("/", function (req, res) {
  response.send("Hotel booking server, Ask for booking!");
});


//[1]create a new booking; Level [2] - simple validation

app.post("/booking", (req, res) => {
  const newBookings = req.body;

  const checkInDate = moment(newBookings.checkInDate);
  const checkOutDate = moment(newBookings.checkOutDate);

    if (!emailValidator.validate(newBookings.email)) {
      res.status(400).json({msg: "email address is not valid"});
      return
    } else if(!checkOutDate.isAfter(checkInDate)) {
      res.status(400).json({msg: "checkoutdate is not after checkindate"});
      return
    }
  
  if (
     !newBookings.id || 
     !newBookings.title || 
     !newBookings.firstName || 
     !newBookings.surname || 
     !newBookings.email || 
     !newBookings.roomId || 
     !newBookings.checkInDate || 
     !newBookings.checkOutDate)  {

   return res.status(400).json({message: "Invalid booking"})
  }

  if (newBookings) {
    bookings.push(newBookings);
    res.status(201).json({ message: "Booking created successfully!" });
  } else {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

// Level 3  search bookings by date:
app.get('/bookings/search', (req, res) => {
  const date  = moment(req.query.date, "YYYY-MM-DD");
  const term = req.query.term;
  if(!date.isValid()){
    res.status(400).send("Invalid date.");
  }else{
   let matchingBookings = bookings.filter((booking) => {
    const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
    const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
    const isDateMatch = date.isBetween(checkInDate, checkOutDate, null, "[]");

    const isTermMatch = term ? 
    booking.email.includes(term) ||
    booking.firstName.includes(term) ||
    booking.surname.includes(term) : true;
    return isDateMatch && isTermMatch;
  });
res.json(matchingBookings);
  }
  });
  
//[2] read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//[3] Read one booking, specified by an ID
app.get("/bookings/:bookingId", (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const findBooking = bookings.find((bookingItem) => {
    return bookingItem.id === bookingId;
  });
  
  if(findBooking){
    res.json(findBooking)
  } else {
    res.status(404).send("booking not found")
  }
});

//[4] Delete a booking, specified by an ID
app.delete("/bookings/:bookingId", (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.findIndex((bookingItem) => { 
    return bookingItem.id === bookingId;
  });

if(booking !== -1){
  bookings.splice(booking, 1);
  res.status(204).json(bookings);
} else {
  res.status(404).send("booking not found");
}
});

// TODO add your routes and helper functions here
function findBookingById(id) {
  return bookings.find((booking) => booking.id == id);
}
// Helper function to generate a new booking ID

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
