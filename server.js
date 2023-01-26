const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

// Home Route
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Reading all the bookings
app.get("/bookings", (req, res) => {
  console.log('Reading all the bookings in /bookings Route');
  res.json(bookings);
});

//Creating a new Bookings
app.post('/bookings', (req, res) => {
  const newBooking = {
    id: parseInt(_.uniqueId()),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: parseInt(_.uniqueId()),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  };

  bookings.push(newBooking);
  res.json(bookings);
});




app.listen(PORT, () => {
  console.log(`You Server is Listening on port ${PORT}`);
});
