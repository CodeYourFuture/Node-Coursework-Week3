const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 59339;

app.use(express.json());
app.use(cors());

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });


//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//[1]create a new booking:
app.post("/bookings", (req, res) => {
  const newBookings = req.body;

  if (!newBookings.id || !newBookings.title  || !newBookings.firstName || !newBookings.sureName || !newBookings.email || !newBookings.roomId || !newBookings.checkInDate || !newBookings.checkOutDate)  {
   return  res.status(400).json({message: "Invalid booking"})
  }


  if (newBookings) {
    bookings.push(newBookings);
    res.status(201).json({ message: "Booking created successfully!" });
  } else {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

//[2] read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//[3] Read one booking, specified by an ID
app.get("/bookings/:bookingId", (req, res) => {
  console.log("Hello")
  const bookingId = parseInt(req.params.bookingId);
  const foundBooking = bookings.find((bookingItem) => {
    return bookingItem.id === bookingId;
  });
  
  if(foundBooking){
    res.json(foundBooking)
  } else {
    res.status(404).send("nothing found")
  }
});

//[4] Delete a booking, specified by an ID
app.delete("/bookings/:bookingId", (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.find((bookingItem) => { 
    return bookingItem.id === bookingId;
  });

  // res.json({ booking: `booking${bookingId} deleted`, booking });
if(booking){
  res.json(booking)
} else {
  res.status(404).send("nothing found")
}
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
