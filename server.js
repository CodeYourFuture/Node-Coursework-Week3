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

//read all bookings
app.get("/bookings", function(req, res){
  res.status(200).send({bookings});
})


// creat new booking

app.post("/bookings", function(req, res){
  const newBooking = req.body;
  if(newBooking.id && newBooking.title && 
    newBooking.firstName && newBooking.surname 
    && newBooking.email && newBooking.roomId 
    && newBooking.checkInDate && newBooking.checkOutDate){
    bookings.push(newBooking);
    res.status(201).send(newBooking);
 }
  else{
    res.send("information missed")
  }
  
})

// get new booking by id
app.get("/bookings/:bookingId", function(req, res){
  const idTofind = +req.params.bookingId;
  const booking = bookings.find((booking)=> 
  booking.id === idTofind);
  if(booking){
    res.status(200).send({booking});
  }
  else{
    res.status(404).send("not found");
  }

})

// delete booking
app.delete("/bookings/:bookingId", function (req, res) {
  const toDelete = +req.params.bookingId;
  const deleteBooking = bookings.findIndex((booking) => 
  booking.id === toDelete);
  if (deleteBooking !== -1) {
    bookings.splice(deleteBooking, 1); //1 means replace
    res.status(200).send({ bookings });
  } else {
    res.status(404).send("Not found");
  }
});

// app.delete("/bookings/:bookingId", function(req, res){
//   const toDelete = +req.params.bookingId;
//   const deleteBooking = bookings.find(item => item.id !== toDelete);
//   if(!deleteBooking){
//     res.status(404).send("not found");
//   }
//   else{
//     res.status(202).send({deleteBooking});
   
//   }

// })

//



// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 9090, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
