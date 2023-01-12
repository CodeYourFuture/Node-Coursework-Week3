const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
//Read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//Create new bookings
app.post("/bookings", (req, res) => {
  let {
    id,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;
  let newBooking = {
    id: bookings.length + 1,
    title: title,
    firstName: firstName,
    surname: surname,
    email: email,
    roomId: roomId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).send("Please make sure all require information is sent");
  } else {
    bookings.push(newBooking);
    res.sendStatus(200);
  }
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let requiredBooking = bookings.find((reqId) => reqId.id === id);
  if (!requiredBooking) {
    res.status(404).send("Please type a valid ID");
  } else {
    res.send(requiredBooking);
  }
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const notDeleted = bookings.filter((booking) => booking.id !== id);
  let toDelete = bookings.find((booking) => booking.id == id);
  if (toDelete === undefined) {
    res.status(404).send("Please type a valid ID");
  } else {
    res.status(200).json({ success: true });
  }
  bookings = notDeleted;
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
