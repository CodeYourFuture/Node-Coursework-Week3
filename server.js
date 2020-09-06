const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");


app.get("/",  (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});


//Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

//Create a new booking


app.post("/bookings", (req, res)=>{

 
    let newBooking = {

      id: bookings.length + 1,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email:req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    }
  
    bookings.push(newBooking)
    res.json(newBooking)
  
})

//Read one booking, specified by an ID

app.get("/bookings/:id", (req, res) => {
  let id = Number(req.params.id);
  let foundBooking = bookings.find((booking) => booking.id === id);
  if (foundBooking) {
    res.json(foundBooking);
  } else {
    res.status(400).json("Sorry, booking not found");
  }
});

//Delete a booking, specified by an ID

app.delete("/bookings/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let bookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (bookingIndex !== -1) {
    bookings.splice(bookingIndex, 1);
    res.json(bookings);
  } else {
    res.status(404).json("Please enter valid ID");
  }
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
