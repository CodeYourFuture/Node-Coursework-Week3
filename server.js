const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

let bookings = [];

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.post('/bookings', function (req, res){
  const booking = req.body;
  booking.id = bookings.length
  bookings.push(booking)
  res.json(booking)
})

app.get('/bookings', function (req, res){
  res.json(bookings)
})

app.get('/bookings/:id', function (req, res) {
  const bookingId = req.params.id
  const foundBooking = bookings.find((booking)=>{
    if(booking.id == bookingId){
      return true
    }
  })

  if(foundBooking){
    res.json(foundBooking)
  }
  else{
    res.status(404).json("booking not found")
  }
} )

app.delete('/bookings/:id', function (req, res){
  const bookingId = req.params.id
  const newBookings = bookings.filter((booking)=>{
    if(booking.id != bookingId){
      return true 
    }
  })
  if(newBookings.length == bookings.length){
    res.status(404).json("booking not found")
  } 
  else{
    bookings = newBookings
    res.json("booking has been deleted");
  }
  
})

app.listen(process.env.Port || 8000);
// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
