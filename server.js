const express = require("express");
const cors = require("cors");
const moment = require("moment");
const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

/* ## Level 1 Challenge - make the booking server

At this first level, your API must allow a client to:

1. Create a new booking
1. Read all bookings
1. Read one booking, specified by an ID
1. Delete a booking, specified by an ID

If the booking to be read cannot be found by id, return a 404.

If the booking for deletion cannot be found by id, return a 404.

All booking content should be passed as JSON. */

app.get("/bookings/search", (req, res) => {
  console.log(req.query.date);
  const date = moment(req.query.date);  
  const result = bookings.filter(booking=>{
    const startDate = moment(booking.checkInDate)
    const endDate = moment(booking.checkOutDate);
    return date.isBetween(startDate,endDate) || date.isSame(startDate) || date.isSame(endDate)
   })
   if(!result.length){
    res.status(404).json({msg:`No booking is found for date: ${req.query.date}`})
    return;
   }
   res.json(result)
});

app.get("/bookings/:id", (req, res) => {
  let id = req.params.id;
  let idExists = bookings.some((booking) => booking.id === Number(id));
  if (!idExists) {
    res.status(404).json({ msg: `Booking ID ${id} does not exist` });
    return;
  }
  let requestedBooking = bookings.filter(
    (booking) => booking.id === Number(id)
  );
  res.json(requestedBooking);
});

app.delete("/bookings/:id", (req, res) => {
  let id = req.params.id;
  let idExists = bookings.some((booking) => booking.id === Number(id));
  if (!idExists) {
    res.status(404).json({ msg: `Booking ID ${id} does not exist` });
    return;
  }
  let deletedIndex = bookings.findIndex((booking) => booking.id === Number(id));
  bookings.splice(deletedIndex, 1);
  console.log(bookings);
  res.json({ msg: `Booking by the ID ${id} is removed` });
});

app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  if (!validator(newBooking)) {
    res
      .status(400)
      .json({ msg: "Please make sure all the required fields are filled in" });
    return;
  }
  let IDs = bookings.map((item) => item.id);
  let max = Math.max(...IDs);
  let newID = max + 1;
  newBooking["id"] = newID;
  res.json(newBooking);
  bookings.push(newBooking);
});



const validator = (obj) => {
  return (
    obj.title &&
    obj.firstName &&
    obj.surname &&
    obj.email &&
    obj.roomId &&
    obj.checkInDate &&
    obj.checkOutDate
  );
};

// TODO add your routes and helper functions here

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
