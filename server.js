const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment")

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//create new  booking
app.post("/bookings", (req, res) => {
  let { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = req.body;
  if (
    title.length > 0 &&
    firstName.length > 0 &&
    surname.length > 0 &&
    email.length > 0 &&
    roomId.length > 0 &&
    checkInDate.length > 0 &&
    checkOutDate.length > 0) {
    bookings.push(req.body);
    res.send({ booking: "success" })
  } else {
    res.status(404).send("Please complete the form")
  }
});

// read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//read one booking

app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const selectById = bookings.find((item) => item.id === bookingId);
  selectById ? res.send(selectById) : res.status(404).send("No booking found");
});

//delete by Id
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const foundId = bookings.filter((item) => item.id !== bookingId);
  if (foundId) {
    bookings = foundId;
    console.log(bookings);
    res.send(bookings);
  } else {
    res.status(404).send("No booking found");
  }
});
app.get("/bookings/search", (req,res)=>{
const searchDate = moment(req.query.date);
if(searchDate) {
  const foundBooking = bookings.find(item => 
    item.checkInDate === searchDate);
    res.send(foundBooking)
}
else{
  res.send(404, "No booking found")
}

})

const port = process.env.PORT || 5000;
app.listen(port);

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
