const express = require("express");
const cors = require("cors");
const port = 3000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Level 1 Challenge - make the booking server
//1. Created a new booking

app.post("/bookings", function (req, res) {
  const bookingData = req.body;
  const newBooking = {
    ...bookingData,
    id: bookings.length + 1,
  };
  bookings.push(newBooking);
  res.json({ newBooking });
});

//Read all bookings
app.get("/bookings", function (req, res) {
  res.json({ bookings });
  console.log(bookings);
});

//Read one booking, specified by an ID

app.get("/bookings/:id", function (req, res) {
  // req.params.id will match the value in the url after /bookings/
  console.log(req.params.id);
  // now we can use the value for req.params.id to find the booking requested
  // find id in an array
  //res.json(bookings[parseInt(req.params.id) - 1]);  it is one way of solution
  const idToFind = Number(req.params.id);
  const booking = bookings.find((booking) => booking.id === idToFind);

  //If the booking to be read cannot be found by id, return a 404.
  if (booking === undefined) {
    res
      .status(404)
      .json({ message: `Couldn't find the booking for id: ${idToFind}` });
  }

  res.json({ booking });
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", function (req, res) {
  const idToDelete = Number(req.params.id);
  const indexToDelete = bookings.findIndex(
    (booking) => booking.id === idToDelete
  );

  //If the booking for deletion cannot be found by id, return a 404.

  if (indexToDelete === -1) {
    res
      .status(404)
      .json({ message: `Couldn't find the booking for id: ${indexToDelete}` });
  }

  const [deleteBooking] = bookings.splice(indexToDelete, 1);
  res.json({ deleteBooking });
});

//All booking content should be passed as JSON - done

app.listen(port, () => {
  console.log("Listening to the port 3000...");
});
