const express = require("express");
const cors = require("cors");
// const moment = require("moment");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// app.use(moment());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

const findBooking = (id) =>
  bookings.find((booking) => booking.id === Number(id));

app.get("/bookings/:id", (req, res) => {
  if (findBooking(req.params.id)) {
    findBooking(req.params.id);
  } else {
    res
      .status(404)
      .json({ msg: `This booking ${req.params.id}  does not exist` });
  }
  res.send(findBooking(req.params.id));
});

app.post("/bookings", (req, res) => {
  // const { id, firstName, surname } = req.body;

  let newBooking = {
    id: bookings.length + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !req.body.email ||
    !checkInDate ||
    !checkOutDate
  ) {
    res.status(400).json({ msg: "Fill in the missing fields" });
  } else {
    bookings.push(newBooking);
    res.json(bookings);
  }
});

app.delete("/bookings/:id", (req, res) => {
  const found = bookings.some(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (found) {
    res.json({
      msg: `Member deleted`,
      bookings: bookings.filter(
        (booking) => booking.id !== parseInt(req.params.id)
      ),
    });
  } else {
    res.status(404).json({
      msg: `The booking with the id ${req.params.id} cannot be found`,
    });
  }
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
