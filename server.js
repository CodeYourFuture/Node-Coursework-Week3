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

// TODO add your routes and helper functions here


//read all bookings
app.get("/bookings", (req,res) => {
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req,res) => {
  let findBookingsById = bookings.find((booking) => booking.id === Number(req.params.id));
  if (findBookingsById) {
    res.send(findBookingsById);
  }else {
    res.sendStatus(404);
  }
})

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req,res) => {
  let deleteBookingsById = bookings.filter((booking) => booking.id === Number(req.params.id));
  if (deleteBookingsById) {
    let removeIndex = bookings.indexOf(deleteBookingsById);
    bookings.splice(removeIndex, 1);
    res.json(bookings);
  }else {
    res.status(404).send(`Booking was not found.`)
  }
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Maira's app is listening on port " + listener.address().port);
});
