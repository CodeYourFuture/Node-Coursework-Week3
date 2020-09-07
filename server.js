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

app.get("/bookings/search", function (request, response) {
  const queryDate = request.query.date
  
  
  if (moment(queryDate, 'YYYY-MM-DD', true).isValid()) {
    
    let result = bookings.filter(booking => 
    moment(queryDate).isBetween(booking.checkInDate, booking.checkOutDate)
    || moment(queryDate).isSame(booking.checkInDate)
    || moment(queryDate).isSame(booking.checkOutDate))

    result.length > 0 ? response.send(result) : response.send(`No booking exists on the ${queryDate}`)
  } else {
    response.status(400).json('Date format is invalid, Please input correct format "YYYY-MM-DD"')
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
