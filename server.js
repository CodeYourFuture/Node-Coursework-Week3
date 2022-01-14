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

//Read or delete one booking, specified by an ID
app.route("/bookings/:id")
.get((req, res) => {
  const bookingId = +req.params.id;
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  if (bookingIndex >= 0)
  res.status(200).json(bookings[bookingIndex]);
  else res.status(404).json({msg: "Booking Id not found!"})
})
.delete((req, res) => {
  const bookingId = +req.params.id;
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  if (bookingIndex >= 0) {
    const deletion = bookings.splice(bookingIndex, 1);
    res.json({Deleted: deletion})
  } else {
    res.status(404).json({msg: "Booking Id not found!"})
  }
})

//To create a new booking and read all bookings
app.route("/bookings")
.post((req, res) => {
  const bookingId = +(Math.random() * bookings.length).toFixed(2);
  const newBooking = {
    id: bookingId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: +req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  };
  if (["title", "firstName", "surname", "email", "roomId", "checkInDate", "checkOutDate"]
  .every(key => {
    if (req.body[key]) {
      return true;
    }
    })
    ) {
      bookings.push(newBooking);
      res.status(200).json({
        msg: "Booking successful",
        yourBooking: newBooking
      })
    } else {
      res.status(400).json({msg: "Missing field! Please complete all fields."})
    }
})//bellow is to read all bookings
.get((req, res) => {
  res.send(bookings)
})

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
