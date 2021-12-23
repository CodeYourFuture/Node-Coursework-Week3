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



// TODO add your routes and helper functions here
//Read all bookings
app.get("/bookings", function (req, res) {
  res.status(200).send(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", function (req, res) {
  const bookingId = req.params.id;
  const index = bookings.findIndex(booking => booking.id == bookingId)
  console.log(index);
  if (index === -1){
    res.status(404).send("Bad Request")
  }else {
    res.status(200).json(bookings[index]);
  }
});

// Create a new booking
app.post("/bookings", function (req, res) {
  const id = bookings.length + 1;
  const title = req.body.title;
  const firstName = req.body.firstName;
  const surname = req.body.surname; 
  const email = req.body.email;
  const roomId = req.body.roomId; 
  const checkInDate = req.body.checkInDate;
  const checkOutDate = req.body.checkOutDate;
  if (
    title === undefined ||
    firstName === undefined ||
    surname === undefined ||
    email === undefined ||
    roomId === undefined ||
    checkInDate === undefined ||
    checkOutDate === undefined ||
    title.length === 0 ||
    firstName.length === 0 ||
    surname.length === 0 ||
    email.length === 0 ||
    roomId <= 0 ||
    checkInDate.length === 0 ||
    checkOutDate.length === 0
  ) {
    res.status(400).send("Some information is missing");
  } else {
    const newBooking = {
      id: id,
      title: title,
      firstName: firstName,
      surname: surname,
      email: email,
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    };
    bookings.push(newBooking);
    res.status(201).send("New booking has been created");
  }
});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", function (req, res) {
  const deleteId = req.params.id;
  const index = bookings.findIndex((booking) => booking.id == deleteId);
  // console.log(index);
  if (index === -1 ){
    res.status(404).send("The id is not found")
  }else{
    bookings.splice(index, 1)
    res.status(201).send("The id has been deleted")
  }
});

const listener = app.listen(3002, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
