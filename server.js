const express = require("express"); 
const app = express(); 
const cors = require("cors"); // to enable CORS

 // Body parser middleware for POST requests
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({extended : false})); // to support URL-encoded bodies
app.use(cors());  // to enable CORS



//Use this array as your (in-machine) data store, in the future it will be replaced with a real database.
const bookings = require("./bookings.json");

// read all bookings
app.get("/booking", function (request, response) {
  response.send({ bookings });
});

// read one booking specified by an id

app.get("/booking/:id", (req, res) => {
  const id = parseInt(request.params.id);
  const found = bookings.some((booking) => booking.id === id); // use .some() method to return either true or false 
  if (found) {
    res.json(bookings.filter((booking) => booking.id === id));
  } else {
    res.status(400).json(`booking with id: ${id} not found`);
  }
});


//Create a new booking
app.post("/booking", function (req, res) {
  const newBooking = req.body;
  bookings.push(newBooking);
  res.send(newBooking);
});

//Delete a booking by ID
app.delete("/booking/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.some((booking) => booking.id === id);
  if (booking) {
    const index = bookings.indexOf(booking);
    bookings.splice(index, 1);
    response.send(booking);
  } else {
    response.status(404).send(`booking with id: ${id} not found`);
  }
});


// Search for bookings

app.get("/booking/search", function (request, response) {
  const term = request.query.term;
  if (term) {
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.firstName.toLowerCase().includes(term.toLowerCase()) ||
        booking.surname.toLowerCase().includes(term.toLowerCase()) ||
        booking.email.toLowerCase().includes(term.toLowerCase()) ||
        booking.roomId.toLowerCase().includes(term.toLowerCase()) ||
        booking.checkInDate.toLowerCase().includes(term.toLowerCase()) ||
        booking.checkOutDate.toLowerCase().includes(term.toLowerCase())
    );
    response.send(filteredBookings);
  } else {
    response.send(bookings);
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
