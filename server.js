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

// return all bookings /bookings

app.get("/bookings", (req, res) => {
  res.send(bookings)
});

// return one booking /bookings/:id

app.get("/bookings/:id", (req,res) => {
  const id = Number(req.params.id);
  const getbooking = bookings.find(booking => booking.id === id);
  res.status(200).json(getbooking)
})

let maxID = Math.max(...bookings.map(c => c.id));

// post a booking
app.post("/bookings", (req,res) => {
  let newBooking = {
    "id": ++maxID, 
    body: req.body,
  }
  bookings.push(newBooking);
  res.status(200).json(newBooking)
})

// delete a booking
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId)

  if(bookingIndex < 0){
    res.sendStatus(404)
    return
  }

  bookings.splice(bookingIndex, 1);
  res.send("booking deleted")
})


const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
});
