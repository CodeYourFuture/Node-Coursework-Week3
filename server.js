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
});

// get booking by id
app.get("/bookings/:id", (req, res) => {
  const bookingId = bookings.find((elem) => elem.id == req.params.id);
  // validation
  if (bookingId) {
    res.status(200).send({
      bookingId,
    });
  } else {
    res.status(404).send({
      message: "Booking's Id not found",
    });
  }
});

// create new booking
app.post("/bookings", (req, res) => {
  let newId = bookings.length + 1; // auto generate new Id

  const newBooking = {
    id: newId,
    ...req.body,
  };

  // validation
  if (
    newBooking.title === "" &&
    newBooking.firstName === "" &&
    newBooking.surname === "" &&
    newBooking.email === "" &&
    newBooking.roomId === "" &&
    newBooking.checkInDate === "" &&
    newBooking.checkoutDate === ""
  ) {
    res.status(400);
    res.send({ message: "Booking Error" });
  } else {
    bookings.push(newBooking);
    res.status(201);
    res.send(newBooking);
  }
});


const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
