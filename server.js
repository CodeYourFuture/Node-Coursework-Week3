const express = require("express");
const cors = require("cors");

const validator = require("email-validator");
const moment = require("moment");


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
const welcomeMessage = "Hotel booking server. Ask for /bookings, etc.";

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/welcome", function (request, response) {
  response.send(welcomeMessage);
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/search", function (request, response) {
  const searchItems = request.query.text || ""
  let foundItems = bookings.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchItems.toLowerCase()) ||
      item.surname.toLowerCase().includes(searchItems.toLowerCase()) ||
      item.email.toLowerCase().includes(searchItems.toLowerCase()) 
  );
  console.log(foundItems);
  const searchDate = moment(request.query.date); 
  if(request.query.date){
    foundItems = foundItems.filter(item => {
      return searchDate.isBetween(item.checkInDate, item.checkOutDate, undefined, "[]");
    })
  }
  
  response.json(foundItems);
});

app.get("/bookings/:id", function (request, response) {
  const bookingsId = request.params.id;
  const oneBooking = bookings.find(
    (eachBooking) => eachBooking.id === parseInt(bookingsId)
  );
  oneBooking
    ? response.json(oneBooking)
    : response.json({ message: "booking not found" });
});


app.delete("/bookings/:id", function (request, response) {
  const bookingsId = request.params.id;
  const oneBooking = bookings.find(
    (eachBooking) => eachBooking.id === parseInt(bookingsId)
  );
  if (oneBooking) {
    bookings = bookings.filter(
      (eachBooking) => eachBooking.id === parseInt(bookingsId)
    );
    response.json({ message: "booking deleted" });
  } else {
    response.json({ message: "booking not found" });
  }
});

// TODO add your routes and helper functions here

app.post("/bookings", function (request, response) {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString("en-UK", { hour12: false });
  const timeStamp = date + " @" + time;

  const NewBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: Math.floor(Math.random() * 121),
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
    Booked_On: timeStamp
  };

  if (
    !NewBooking.firstName ||
    !NewBooking.surname ||
    !NewBooking.email ||
    !NewBooking.checkInDate ||
    !NewBooking.checkOutDate ||
    !NewBooking.title 
  ) {
    return response
      .status(400)
      .json({ message: "Please fill all required areas" });
  }
  if (!validator.validate(NewBooking.email)){
    return response
      .status(400)
      .json({ message: "Please enter a valid email" });
  }

  bookings.push(NewBooking);
  response.json(bookings);
});


const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
