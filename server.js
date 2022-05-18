const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Search booking by date
app.get("/bookings/search", (req, res) => {
  console.log(req.query);
  const findDate = bookings.filter(
    (booking) => booking.checkInDate === req.query.searchDate
  );
  res.send(findDate);
});

//Search for bookings
app.get("/bookings/search", (req, res)=>{
  let filteredBookings = bookings.filter((booking)=>booking.firstName.includes(req.query.text));
  res.send(filteredBookings);
})

//Creat a new booking
let id = 6;
app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res.status(404).send("Booking, not successful!");
  }
  bookings.push({ id: id++, ...req.body});
  return res.status(200).send("Booking successful!");
});

//Read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (!findById) res.status(404).send("Booking not found");
  res.send(findById);
});

//Delete a booking, specified by id
app.delete("/bookings/:id", (req, res) => {
  const deleteById = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );
  bookings.splice(deleteById, 1);
  if (deleteById === -1) res.sendStatus(404);
  res.sendStatus(200).send("Booking successfully deleted");
});

const listener = app.listen(process.env.PORT || 3500, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
