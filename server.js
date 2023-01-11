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

//1. Create a new booking
app.post("/booking", (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
  ) {
    res.status(400).send(`Some details are missing`);
    return;
  } else {
    console.log(req.body.title);
    console.log(req.body.surname);
    const newBooking = {
      id: ++maxID,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: maxID + 100,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    };
    // console.log(bookings);
    bookings.push(newBooking);
    // res.send(bookings.length);
    // console.log(bookings);
    return;
  }
});

const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
