const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const maxID = Math.max(...bookings.map(booking => booking.id)); 

app.get("/", (request, response) => {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(7000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// returning all bookings endpoint
app.get("/bookings", (request, response) => {
  response.send(bookings); 
})

// returning one booking by ID 
app.get("/booking/:id", (request, response) => {
  const id = +request.params.id; 
  console.log(id); 
  const booking = bookings.find((booking) => booking.id === id);

  // validation 

  if(!booking){
    response.status(404).send("404 Not Found");
  } else{
    response.send(booking); 
  }
})

// Adding a new booking using post request
app.post("/bookings", (request, response) => {
  let idNew = maxID + 1; 

  const newBooking ={
    id: idNew,
    title: request.body.title,
    firstName: request.body.firstName, 
    surname: request.body.surname, 
    email: request.body.email, 
    roomId: request.body.roomId, 
    checkInDate: request.body.checkInDate, 
    checkOutDate: request.body.checkOutDate
  }; 
// making sure all the filed are filled 
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).send("Please fill all fields");
  } else {
  bookings.push(newBooking);
  response.send("Booking added successfully", newBooking);
  }

}); 
