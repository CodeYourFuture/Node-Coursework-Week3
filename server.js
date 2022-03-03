const express = require("express");
const cors = require("cors");
const moment = require('moment');

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { urlencoded } = require("express");

//Create a new booking
let nextId = 6;
app.post('/bookings', (req, res) => {

  const newBooking = {
    id: nextId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate

  };

  if(!newBooking.title || !newBooking.firstName || !newBooking.surname || !newBooking.email ||!newBooking.roomId || !newBooking.checkInDate || !newBooking.checkOutDate){
       res.status(404).json({ msg: `Please fill every box`});
    } else if(bookings.find(booking => booking.id == newBooking.id)){
      res.status(404).jsonp({msg: "booking id already exist"});
    }else{
      bookings.push(newBooking);
      res.json(bookings);
      nextId++;
    }
  
});


//Get all bookings
// app.get('/bookings', function (request, response) {
//   response.json(bookings);
// });

//Get one booking, specified by an ID
// app.get('/bookings/:bookingId', function (req, res) {
//   const foundBooking = bookings.find(booking => booking.id == req.params.bookingId);
//   if(foundBooking){
//     res.send(bookings.filter(booking => booking.id == req.params.bookingId));
//   }else {
//     res.status(404).json({msg:`No booking with the id of ${req.params.bookingId}`})
//   }
  
// });
//Delete a booking, specified by an ID
app.delete('/bookings/:bookingId', function (req, res){
  const bookingPosition = bookings.findIndex(booking => booking.id == req.params.bookingId);
  if(bookingPosition === -1){
    res.status(404).json({msg:`booking with id ${req.params.bookingId} not found`});
  } else {
    res.json(bookings.slice(bookingPosition, 1));
    res.status(200).json({success: true, msg: `booking with id ${req.params.bookingId} has been deleted`});
  }
});

//Search by date
//`/bookings/search?date=2019-05-20`
app.get('/bookings/search', (req, res) => {
  let date = req.query.date;
  const foundDate = bookings.filter(
    (booking) =>
      moment(date).isSame(booking.checkInDate) ||
      moment(date).isSame(booking.checkOutDate)
  );  
 
  res.send(foundDate);
    
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

