const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
// gets all bookings 
app.get("/bookings", (request, response) => {
res.send(bookings);
});

//Creates a new booking for data
app.post("/bookings", (request, response) => {
  let newBookingTable = {
    id: 0,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: 0,
    checkInDate: request.body. checkInDate,
    checkOutDate: request.body.checkOutDate,
  }
});
let  {title, firstName, surname, email, checkInDate, checkOutDate} = request.body;
  if(
    !title ||
    !surname ||
    !email ||
    !checkInDate ||
    !checkOutDate 
  ){
  
    response.status(400).send({message: " ERROR All fields have not been completed please try again"});
  }
  bookings.push(newBookingTable);
  newBookingTable.id = bookings.findIndex(newBooking) + 1;
  newBookingTable.roomId = newBookingTable.id + 10;

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
