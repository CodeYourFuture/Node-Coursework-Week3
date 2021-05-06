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
// get all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
})

// get booking by id
app.get("/bookings/:id", (req, res) => {
  
  const bookingId = bookings.find((elem) => (elem.id) == (req.params.id));
    
  if(bookingId) {
    res.status(200).send({
    booking:  bookingId});
  } else {
    res.status(404).send({
      message: "Booking's Id not found"
    })
  }
})

const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
