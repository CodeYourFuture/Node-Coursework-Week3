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
//1. Create new booking
  //post request /bookings
  //var newBooking stores new booking obj
  //
  app.post("/bookings", (request, response) => {
    const lastBooking = bookings[bookings.length - 1];
    const lastBookingId = lastBooking.id; 
    const newBooking = {
      id: lastBookingId + 1,
      roomId: request.body.roomId,
      title: request.body.title,
      firstName: request.body.firstName,
      surname: request.body.surname,
      email: request.body.email,
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate
    }

    bookings.push(newBooking);
    return response.send('Booking added')
  })


//2. Read all bookings
  //get req
  app.get("/bookings", (request, response) => {
    response.send(bookings);
  })
  
 
 //3. Read one booking by Id
  //get req with bookingId params
  //return 404 if no booking by Id
  app.get("/bookings/:bookingId", (request, response) => {
      const bookingId = request.params.bookingId;

       if (bookingId) {
         const filteredBooking = bookings.filter(
           (booking) => booking.id == bookingId
         );
         if (filteredBooking.length > 0) {
           return response.send(filteredBooking);
         } else {
           return response.sendStatus(404);
         } 
      
       }
   
    });
  
//4. Delete a booking by Id
  //delete req with bookingId params  
   //return 404 if no booking by Id

    app.delete("/bookings/:bookingId", (request, response) => {
      const bookingId = request.params.bookingId;

      if (bookingId) {
        const bookingIndex = bookings.findIndex(
          (booking) => booking.id == bookingId
        );
       
      //non-existent booking has index of -1, so will throw 404 
        if (bookingIndex >= 0 ) {
          bookings.splice(bookingIndex, 1);
          return response.send('Booking deleted');
        } else {
          return response.sendStatus(404);
        }
      }
    });


    

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});