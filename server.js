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



app.get("/bookings", function (request, response) {
  response.status(200).send({bookings});
});



app.get("/bookings/:id", function (request, response) {
  const idToFind = Number(request.params.id);
  const booking = bookings.find((booking) => booking.id === idToFind);
  console.log(booking);
  response.status(200).send(booking);
});

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

const port = 3000;
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});





// Use express.json() middleware to parse incoming JSON data.
// Use cors() middleware to enable Cross-Origin Resource Sharing.
// Require the bookings data by using the require() function and assigning it to a variable named bookings. The data is in a separate file named bookings.json.

// Define the routes for handling the bookings:

// For GET /bookings, return all bookings.
// For GET /bookings/:id, return a single booking identified by its id.
// For GET /bookings/search, return all bookings that match a search term passed as a query parameter.
// For POST /bookings, create a new booking and return it.
// For DELETE /bookings/:id, delete a booking identified by its id.
// Start the server by calling the app.listen() method and passing in a port number.

// Test the server by sending requests to each of the defined routes using Postman or any other RESTful API testing tool.

