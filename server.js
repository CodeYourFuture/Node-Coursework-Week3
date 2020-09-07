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

// *******Get all bookings*****

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// **** Create new booking *****

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookings.length + 1, // temp solution for now to match with other id, I can use uuid for bigger pros
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  bookings.push(newBooking);
  res.json(bookings);
});

// ******** Get one by id *******

app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    res.json(selectedBooking);
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

// ******** Delete one by id *******

app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.filter((booking) => booking.id !== id);
    res.json({ msg: `Boking with id number ${id} deleted`, selectedBooking });
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

// const port = process.env.PORT || 7070

const listener = app.listen(process.env.PORT || 7070, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
