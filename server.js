const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();

//app.use(express);
app.use(cors());
app.use(bodyParser())

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", (request, response) => {
  response.json(bookings);
});

app.post("/bookings", (request, response) => {
  if(request.body.title ==="" ||request.body.firstName ===""||request.body.surname ===""||request.body.email ===""||request.body.roomId ===""||request.body.checkInDate ===""||request.body.checkOutDate ===""){
    response.send(400)
  } else {
  console.log(request.body)
  const addedId = bookings.length + 1;
  request.body.id = addedId
  bookings.push(request.body);
  response.json({ success: true });
  }
});

app.get("/bookings/:id", (request, response) => {
  const bookingId = request.params.id
  const chosenBooking = bookings.find(booking => booking.id == bookingId)
  response.json(chosenBooking)
})

app.delete("/bookings/:id", (request, response) => {
  const bookingId = Number(request.params.id)
  bookings = bookings.filter(booking => booking.id !== bookingId)
  response.json({success: true})
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
