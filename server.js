

const express = require("express");
const cors = require("cors");

const app = express();
const port = 50910;
app.use(express.json()); // before our routes definition;
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
  console.log(bookings.length)
});

// TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

// Do not understand the above code if you can explain this 
app.listen(port, ()=>{
 console.log("Your app is listening on port ", port)
})

// Creating a new booking
app.post("/bookings", (req, res)=>{
const nextId = bookings.length +1;
const newBooking = req.body
newBooking.id = nextId
bookings.push(newBooking)
res.status(201).send(newBooking)
})

// Reading all bookings
app.get("/bookings", (req, res) => {
  res.status(200).send(bookings)
})

// Reading one booking, specified by an ID
app.get("/bookings/:id", (req, res)=>{
  const bookingToFind =Number(req.params.id)
  const booking = bookings.find(booking=>booking.id === bookingToFind)
  console.log(booking)
  if (booking === undefined || booking === ""){
    res.status(404).send("404 not found")
  }
  else{
    res.status(200).send(booking)
  }  
})

// Deleting a booking, specified by an ID
app.delete("/bookings/:id", (req, res)=> {
  const bookingToFind = Number(req.params.id)
  let booking = bookings.find(booking => booking.id === bookingToFind)
  if (booking === undefined || booking === " ") {
    res.status(404).send("404 not found")
  }
  else {
    bookings = bookings.filter(booking => booking.id !== bookingToFind)
    res.send("Element has been deleted successfully ")
  }  
})


// Level 2- Simple validation
// added V at the end of the route to make difference with the first post without valadation
app.post("/bookingsv", (req, res) => {
  const nextId = bookings.length + 1;
  const newBooking = req.body
  const {title, firstName, surname, email, roomId, checkInDate, checkOutDate} = newBooking
  if ( title === undefined || title === "" || firstName === undefined || firstName ===""|| surname === undefined || surname ===""|| email === undefined || email === "" || roomId === undefined || roomId === ""|| checkInDate === undefined || checkInDate === "" || checkOutDate === undefined || checkOutDate === "") 
   res.status(400).send("Missing information, please fill all the the fields")
   else {
    newBooking.id = nextId
    bookings.push(newBooking)
    res.status(201).send("Your booking is confirmed")
  }
})