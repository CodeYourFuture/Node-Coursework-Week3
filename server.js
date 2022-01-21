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

app.get ("/bookings", function ( request ,response){
response.json(bookings);
});

app.get("/bookings/bookingId", function (request, response){
  const bookingId = request.params.bookingId;
  const booking = bookings.find(function (booking) {
    return booking.bookingId === bookingId;
      response.json(booking[0]);
  });

  app.put("/bookings/;bookingId", function (request, response) {
    bookings.forEach((el, index) => {
      if (el.id == request.params.bookingId) {
        let newBooking = { ...el, ...request.body };
        bookings[index] = newBooking;
      }
    });
    response.json({ success: true });
  });

// TODO add your routes and helper functions here
let Id = 1;
app.post("/bookings", (request, response) => {
  const bookings = {};
  booking.id = Id;
  booking.from = request.body.from;
  booking.text = request.body.text;

  if (booking.from != " " && booking.text != "") {
    booking.push(booking);
    Id = Id + 1;
    save();
    response.json({
      status: "success",
      booking: "request.body",
    });
  } else {
    response.json(404);
  }
});

// app.get("/bookings/:bookingId", function (request, response) {
//   let booking = bookings.filter((booking) => booking.id == request.params.bookingId);

//   response.json(booking[0]);
// });



// If the booking to be read cannot be found by id, return a 404.

// If the booking for deletion cannot be found by id, return a 404.

// All booking content should be passed as JSON.
app.listen(process.env.PORT)});