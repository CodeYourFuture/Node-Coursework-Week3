const express = require("express");
const cors = require("cors");
const moment = require('moment');
// moment().format(YYYY-MM-DD); 

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
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  newBooking.id = bookings.length + 1 ; 
  if(!req.body.title ||
     !req.body.firstName || 
     !req.body.surname || 
     !req.body.email || 
     !req.body.roomId || 
     !req.body.checkInDate || 
     !req.body.checkOutDate
     ) {
    res.status(400);
    res.send("You need to fill all the fields");
  } else {
    bookings.push(newBooking);
    res.status(201);
    res.send(bookings);
  }  
})


app.get("/bookings/search", (req, res) => {
  const searchDate = req.query.date;
  const isDateValid = moment(searchDate, "YYYY-MM-DD", true).isValid();
  if (isDateValid) {
    const searchBooking = bookings.filter((booking) => {
     return moment(searchDate).isBetween(booking.checkInDate, booking.checkOutDate, undefined, '[]');      
    });
    (searchBooking ? res.status(200).json(searchBooking) : res.send(`There isn't any booking with the date: ${searchBooking}`));
    
  } else{
    res.status(400);
    res.send("Please enter date in YYYY-MM-DD format.")
  }
});

app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const requestedBooking = bookings.find(booking => booking.id === id)
  if(!requestedBooking) {
    res.status(404).send(`Booking with ID: ${id} not found`);
  } 
    res.status(200).json(requestedBooking);
});

app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  let deletedBooking;
  bookings.map(booking => {
  if(booking.id === id) {
    bookings.splice(id, 1);
    deletedBooking = booking;
  }   
  })
  if(!deletedBooking) {
    res.status(404);
    console.log(id);
    res.send(`Booking with ID: ${id} has not found`);
  } else {
    res.status(200);
    console.log(deletedBooking);
    res.send(`Booking with ID: ${id} has been deleted`);
  }
});

const PORT = 3000;

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

/*
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

*/
