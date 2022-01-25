const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const req = require("express/lib/request");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

app.get ("/", function ( request ,response){
response.json(bookings);
});

app.post("/booking", (request, response) => {
  const bookingId = request.body.id;
  const booking = bookings.find((booking) => booking.id == bookingId);
  if (booking) {
    response.status(404).send({ message: "This booking already exists" });
  } else {
    bookings.push(request.body);
    response.status(201).send();
  }
});

app.get("/bookings/:id", (request, response) =>{
  const bookingId = request.params.id;
  const booking = bookings.find((booking) => {
    return booking.id == bookingId;
  });

  if (booking) {
    response.send(booking);
  } else {
    response.status(404).send({ message: "Booking not found" });
  }
});
  
  app.delete("/bookings/:id", (request, response) => {
   const bookingId = request.params.id;

   bookings = bookings.filter((booking) => 
      booking.id != request.params.id);
  });
      response.json(bookings);
  

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});




