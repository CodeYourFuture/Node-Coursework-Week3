const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 45095;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const bookingKeys = Object.keys(bookings[0]);
console.log(bookingKeys);
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
  // response.send(bookings[0]);
});

app.post('/newbooking', (req, res) => {
  const createBooking = req.body;
  // console.log(createBooking);
  const keysChecked = bookingKeys.filter((bookingKey) => {
    return (!(createBooking.hasOwnProperty(bookingKey)) || ((createBooking[bookingKey].toString().trim() === ""))) 
    })
    if(keysChecked.length === 0){
      bookings.push(createBooking)
      res.json(bookings)
    } else {
      res.status(400).send("Not found")
    }
  });

app.get('/readbookings', (req, res) => {
  res.json(bookings);
});

app.get('/readbookings/:ID', (req, res) => {
  const bookingID = req.params.ID;
  const oneBooking = bookings.find((obj) => {
    return obj["id"] === parseInt(bookingID)
  })
  res.json(oneBooking)
});

app.delete('/deletebooking/:ID', (req, res) => {
  const bookingToDelete = req.params.ID;
  const bookingIndex = bookings.findIndex((elem) => {
    return elem["id"] === parseInt(bookingToDelete)
  })
  bookings.splice(bookingIndex, 1)
  res.send("DELETED")
});


// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
