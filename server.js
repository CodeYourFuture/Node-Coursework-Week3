const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { request, response } = require("express");
const { json } = require("express/lib/response");
// const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//missing properties --> don't add
//extra properties ---> add but ignore unfamiliar ones

//empty object ---> don't add
const isObjEmpty = (bookingObj) => {
  return Object.keys(bookingObj).length === 0;
};

//correct object ---> add
// const objHasCorrectProperties = (bookingObj) => {
//   if ("roomId" in bookingObj 
//       && "title" in bookingObj
//       && "roomId" in bookingObj
//       && "firstName" in bookingObj
//       && "surname" in bookingObj 
//       && "email" in bookingObj
//       && "checkInDate" in bookingObj 
//       && "checkOutDate" in bookingObj
//       ){
//         bookings.push();
//         return response.send("Added booking");
//       } else {
//         return response.sendStatus(404);
//       }; 
// };

//Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  response.send(bookings.find((booking) => booking.id === Number(request.params.id)));
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  bookings = bookings.filter(booking => booking.id != request.params.id);
  response.send(bookings);
});

//Read all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

// 1. Create a new booking
app.post("/bookings", (request, response) => {
  if (isObjEmpty(request.body)) {
    return response.sendStatus(404);
  } else if (request.body) {
    // return objHasCorrectProperties(request.body);
    bookings.push(request.body);
    return response.send("Added booking");
  };
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
