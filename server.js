const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment")
const validator = require("email-validator")

const app = express()

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map(c => c.id))

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings.");
});

// getting all data

app.get("/bookings" , (req,res)=>{
  res.json(bookings)
})

// query for date and name

app.get("/bookings/search",(req,res)=>{
  let { date ,term}= req.query
  let filteredBookings = []
  if(!term && !date){
    return res.status(400).send("Enter search query")
  } else if (date){
    filteredBookings = bookings.filter(
      (booking)=>
      moment(booking.checkInDate).isSame(date) ||
      moment(booking.checkOutDate).isSame(date)
  );

  } else if(term){
    term = term.toLowerCase()
    filteredBookings = bookings.filter(
      (booking)=>
      booking.firstName.toLowerCase().includes(term)||
      booking.surname.toLowerCase().includes(term) ||
      booking.email.toLowerCase().includes(term)
    )
  } else{
    return
  }
  if(filteredBookings.length > 0){
    res.send(filteredBookings)
  } else{
    res.status(404).send("Please Enter correct entry")
  }
  })

  // finding booking by id
  app.get("/bookings/:id",(req,res)=>{
    let id = parseInt(req.params.id)
    let filteredBookings = bookings.find((booking)=>booking.id === id)

    if(!filteredBookings){
      res.status(404).send(`No booking with the ${id} is found`)
      return
    }
    res.send(filteredBookings)

  })

  // creating new post
  app.post("/bookings",(req,res)=>{
    if(
    !req.body.title ||
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.roomId ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
    ){

    }

    if (validator.validate(req.body.email) === false) {
      res.status(400).send("Please enter a valid email");
    }
  
    if (moment(req.body.checkInDate) > moment(req.body.checkOutDate)) {
      response.status(400).send("Please enter a valid dates");
    }
    const newBooking = {
      id: ++maxID,
      title: req.body.title,
      firstName: req.body.firstName,
      username: req.body.username,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    };
  
    bookings.push(newBooking);
    res.send(bookings);
  });

  app.delete("/bookings/:id", (req, res) => {
    const delBookingId = parseInt(req.params.id);
    const foundBookingIndex = bookings.findIndex(
      (booking) => booking.id === delBookingId
    );
    if (foundBookingIndex < 0) {
      res.sendStatus(440);
      return;
    }
    bookings.splice(foundBookingIndex, 1);

    res.send(`Booking with the id ${delBookingId} has been deleted`)
  });











// TODO add your routes and helper functions here


const listener = app.listen(process.env.PORT || 3002, function () {
  console.log("Your app is listening on port " + listener.address().port);
});