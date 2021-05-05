const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("<h2>Hotel booking server.  Ask for /bookings, etc.</h2>");
});


//Read all bookings
app.get("/bookings", function(req, res){
  res.json(bookings);
})


//Read one booking, specified by an ID
app.get("/bookings/:id", function(req, res){
  const id = parseInt(req.params.id);
  const filteredId = bookings.filter(booking => booking.id === id);

  if(filteredId){
    res.json(filteredId)
  } else {
   res.sendStatus(404);
  }
})



//Create a new booking
app.post("/bookings", function(req, res) {
  const newBooking = req.body;
  newBooking.id = bookings.length;
  

  if(newBooking.title && newBooking.firstName && newBooking.surname && newBooking.email && newBooking.roomId && newBooking.checkInDate && newBooking.checkOutDate){
    bookings.push(newBooking);
    res.sendStatus(400)
  }
})


//Delete a booking, specified by an ID
app.delete("/bookings/:id", function(req, res){
   const id = parseInt(req.params.id);
   const bookingIndex = bookings
        .findIndex(booking => booking.id === id);
    if (bookingIndex >= 0) {
        bookings.splice(bookingIndex, 1);
    }
})

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
