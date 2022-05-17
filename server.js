const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Read all bookings 
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//Create a booking 
let addBookingId = 6;
let addRoomId = 7;
app.post("/bookings", (req, res) => {
  const { title, firstName, surname, email, checkInDate, checkOutDate } = req.body;
  if (!title || !firstName || !surname || !email || !checkInDate || !checkOutDate) {
    res.status(404).send("You must fill all the details")
  }
  else {
    bookings.push({
      ...req.body,
      id: addBookingId,
      roomId: addRoomId
    })
    res.status(202).send("You have been booked")
    addBookingId++;
    addRoomId++;
  }
})

//Read booking by ID
app.get("/bookings/:id", (req, res) => {
  let requestedId = Number(req.params.id);
  let readBookingById = bookings.filter((booking) => booking.id === requestedId)
  if (readBookingById.length === 0) {
    res.status(404).send(`Booking with  id:${requestedId} does not exist`)

  } else {
    res.send(readBookingById)
  }
})

//Delete booking by ID
app.delete("/bookings/delete/:id", (req, res) => {
  let requestedId = Number(req.params.id);
  let findIndex = bookings.findIndex((booking) => booking.id === requestedId)
  // if the index does't not exist
  if (findIndex < 0) {
    res.status(404).send(`Booking with  id:${requestedId} does not exist`)
  } else {
    res.status(200).send("The booking was deleted")
    bookings.splice(findIndex, 1)
  }
});


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
