const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 59339 ||process.env.PORT;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");


//[1]create a new booking:
app.post('/bookings', (req, res) => {
const newBookings = req.body;
if(newBookings){
  bookings.push(newBookings);
  res.status(201).json({ message: 'Booking created successfully!'});
}else{
  res.status(400).json({message: 'Invalid booking data'});
}
});

//[2] read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//[3] Read one booking, specified by an ID
app.get("/bookings/:bookingId", (req, res)=>{
  const bookingId = parseInt(req.params.bookingId);
  const foundBooking = bookings.find((bookingItem)=>{
   return bookingItem.id === bookingId;
  });


  res.json(foundBooking);

})

//[4] Delete a booking, specified by an ID
app.delete("/bookings/:bookingId", (req, res)=>{
  const bookingId = parseInt(req.params.bookingId);
 const booking = bookings.filter((bookingItem) =>{
  });
  

  res.json({ booking: `booking${bookingId} deleted`, booking });
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

