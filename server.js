const express = require("express");
const cors = require("cors");

const app = express();
// app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});


// TODO add your routes and helper functions here

//read all bookings
app.get('/bookings', (req, res) => {
  res.json(bookings)
})
//create a new booking (Postman)
app.post('/bookings', (req, res) => {
  const newBooking = req.body;
  newBooking.id = bookings.length + 1;

  for (let elem in newBooking) {
    if (!newBooking[elem]) {
      res
        .status(400)
        .send(`Please fill out all fields!`);
    }
    else {
      bookings.push(newBooking);
      res.send(bookings);
    }
  }

})

//helper function to find booking with id
const bookingById = (ID) => bookings.find(booking => booking.id == ID);
//read one booking, specified by an ID
app.get('/bookings/:ID', (req, res) => {
  const ID = req.params.ID;
  if (bookingById(ID)) {
    res.send(bookingById(ID));
  } else {
    res
      .status(404)
      .send(`Booking with the id ${ID} does not exist in the system.`);
  }

})
//delete a booking, specified by an ID (Postman)
app.delete('/bookings/:ID', (req, res) => {
  const ID = req.params.ID;
  if (bookingById(ID)) {
    const removeBooking = bookings.filter(booking => booking.id !== parseInt(ID));

    res.send(removeBooking);
  } else {
    res
      .status(404)
      .send(`Booking with the id ${ID} was not found.`);
  }
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});
