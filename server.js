const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const app = express();

app.use(express.json());
app.use(cors());
moment().format();

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");


app.get("/",  (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});


//Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});




// search by date

app.get("/bookings/search", function (req, res) {
  const queryDate = req.query.date;
  const queryTerm = req.query.term;
  if (!queryTerm && !queryDate) {
    res.status(400).json("Try again your search again :)");
    return;
  }
  
  if (moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    let result = bookings.filter(
      (booking) =>
        moment(queryDate).isBetween(
          booking.checkInDate,
          booking.checkOutDate
        ) ||
        moment(queryDate).isSame(booking.checkInDate) ||
        moment(queryDate).isSame(booking.checkOutDate)
    );
    result.length > 0
      ? res.send(result)
      : res.send(`No booking found on this ${queryDate} date`);
    return;
  } else if (queryDate) {
    res
      .status(400)
      .json('Please enter date with correct format "YYYY-MM-DD"');
    return;
  }
 
  const searchbooking = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(queryTerm.toLowerCase())
  );
  if (queryTerm && searchbooking.length > 0) {
    res.json(searchbooking);
  } else if (queryTerm) {
    res.status(400).json(`Sorry, no booking can be found for ${queryTerm}`);
  }
});

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

//Create a new booking
// simple validation - booking object is missing or empty

app.post("/bookings", (req, res)=>{

  let keys =[
  
    "title",
    "firstName",
    "surname",
    "email",
    "roomId",
    "checkInDate",
    "checkOutDate"
  ]
  
    for(let key in req.body){
      
      if(!req.body[key] || !keys.includes(key)){
        res.status(400).send('Please fill in all fields')
      }
    }

  //validate email format
    if (!validator.validate(req.body.email)) {
      res.status(400).json("Please enter a valid email address");
      return;
    }
  //validate checkoutDate is not after checkinDate 
    if (!moment(req.body.checkInDate).isBefore(req.body.checkOutDate)) {
    res
      .status(400)
      .json("Check in date is after checkout date, please enter valid dates");
    return;
  }

  
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
