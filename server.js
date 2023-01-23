const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 4200;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here


//Read all the bookings 
app.get("/bookings", function (request, response) {
  response.status(200).json(bookings);
});

//Creating bookings
app.post("/bookings", function (request, response) {
  let booking = request.body;
  console.log(request.body);
  bookings.push(booking);
  response.status(200).json(bookings);
});

// Read one booking 
app.get("/bookings/:id", function (request, response) {
  console.log(request.params.id);
  let oneBooking = parseInt(request.params.id);
  const find = bookings.find(item => item.id === oneBooking)
  if(find){
    response.status(200).json(bookings.filter(elt => elt.id === oneBooking));
  }else{
    response.status(404).json({msg:`The requested booking with this id ${oneBooking} is not found`});
}
});

//Delete one element from the array;
app.get("/bookings/:id", function (request, response) {
  console.log(request.params.id);
  let oneBook = parseInt(request.params.id);
  const found = bookings.find(item => item.id === oneBook);
  if(found){
    response.json({msg: `Booking ${oneBook}is deleted`, bookings: bookings.filter(elt => elt.id !== oneBook)});
  }else{
    response.status(404).json({msg:`booking with this id${oneBook} is not found `});
}
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
