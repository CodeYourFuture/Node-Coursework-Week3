const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Create new booking

app.post("/booking", (req, res) => {
  let { title, firstName, surname, email, roomId, checkInDate, checkOutDate } =
    req.body;

   bookings.push(req.body);
   res.send({booking:"Booking is recorded successfully!"})
});

//Read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
