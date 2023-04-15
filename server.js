const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings", function (request, response) {
  response.send({bookings});
});

app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  console.log(newBooking,"newbookings");
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response.status(404).send("fill in information");
  } else {
    bookings.push(newBooking);
    response.status(201).send({ newBooking });
  }
});

app.get("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  const findId = bookings.find(booking => booking.id === Number(bookingId))
  if(findId){
     response.send(findId)
     console.log(findId)
  }else{
    response.status(404).send("message not found");
  }
});

app.delete("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  const findIndex = bookings.findIndex((booking) => booking.id === Number(bookingId));
  if (findIndex !== -1) {
    bookings.splice(findIndex,1);
    response.status(204).send();
  } else {
    response.status(404).send("message not found");
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 6000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
