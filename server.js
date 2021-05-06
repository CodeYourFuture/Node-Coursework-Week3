const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookings[bookings.length - 1].id + 1, // The id field is assigned upon successful post.
    ...req.body,
  };

  // check that all field is filled out
  if (
    newBooking.title !== "" &&
    newBooking.firstName !== "" &&
    newBooking.surname !== "" &&
    newBooking.email !== "" && // this can be validated as well
    newBooking.roomId !== "" &&
    newBooking.checkInDate !== "" &&
    newBooking.checkOutDate !== ""
  ) {
    bookings.push(newBooking);
    res
      .status(201)
      .json(
        `Successfully created a new booking with Id number ${newBooking.id}!.`
      );
  } else {
    res.status(400).json("Please Fill all the form fields, thanks!");
  }
});

// free-text search
app.get("/bookings/search", (req, res) => {
  const searchTerm = req.query.term;
  const searchResult = bookings.filter((element) => {
    return (
      element.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (searchResult) {
    res.json(searchResult);
  } else {
    res.status(404);
  }
});

// Read one booking, specified by an ID. If the booking to be read cannot be found by id, return a 404.
app.get("/bookings/:id", (req, res) => {
  const getBookingId = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  getBookingId
    ? res.json(getBookingId)
    : res.status(404).json({ message: "Booking Id not found" });
});

// Delete a booking, specified by an ID. If the booking for deletion cannot be found by id, return a 404.
app.delete("/bookings/:id", (req, res) => {
  const deleteBooking = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (deleteBooking >= 0) {
    bookings.splice(deleteBooking, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: "Booking Id not found" });
  }
});

// // //Check that port 4050 is not in use otherwise set it to a different port
// const PORT = process.env.PORT || 4050;

// // //Start our server so that it listens for HTTP requests!
// app.listen(PORT, () => console.log(`Your app is listening on port ${PORT}`));

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
