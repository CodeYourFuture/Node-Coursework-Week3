const express = require("express");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const bookings = require("./bookings.json");



//const booking = [sampleBooking];
//Use this array as your (in-memory) data store.


app.get("/", function(request, response){
  response.send("Kate's Hotel booking server.  Ask for /bookings, etc.");
});


// TODO add your routes and helper functions here

//get all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
})

//helper function to find booking with id
const bookingById = (id) =>
  bookings.find((booking) => booking.id === Number(id));

//get one booking by ID
app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  
  if(bookingById(id)) {
    res.send(bookingById(id));
     } else {
       res.status(404).send(`Booking with the id ${id} does not exist in the system.`);
     }
  
})
//delete one booking by ID
app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  
  if (bookingById(id)) {
    const removeIndex = bookings.indexOf(bookingById(id));
    bookings.splice(removeIndex, 1);
    res.json(bookings);
  } else {
    res
      .status(404)
      .send(`Booking with the id ${id} was not found.`);
  }
});

//create new booking 
app.post('/bookings', (req, res) => {
  const newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName: req.body.firsName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.chechOutDate
  }
  for(let property in newBooking) {
    if(!newBooking[property]) {
    res.status(400).send(`Please fill out all fields!`);
  }
  else {
     bookings.push(newBooking);
     res.send(bookings);
  }
  }})

//app.get("/bookings/random", (req, res) => {
  //res.send(lodash.sample(bookings));
//})

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});


  
     
