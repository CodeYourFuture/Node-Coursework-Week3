const express = require("express");
const cors = require("cors");
const app = express();
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map((c) => c.id));




app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here


//Read All bookings
app.get("/allBookings", (req, res) => {
  res.json(bookings)
})

//Read one booking, specified by an ID
// app.get("/booking/:id", (req, res) => {
//   const bookingId=req.params.id;
//   if()
//   res.json(bookings);
// });
//1. Create a new booking
app.post("/booking", (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.checkInDate ||
    !req.body.checkOutDate ||
    !req.body.roomId
  ) {
    res.status(400).send(`Some details are missing`);
    return;
  } else {
    const newBooking = {
      id: ++maxID,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    };
    // console.log(newBooking);
    bookings = [...bookings, newBooking];
    res.send(bookings);
    // console.log(bookings);
    return;
  }
});

const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
