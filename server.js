const { response, json } = require("express");
const express = require("express");
//const cors = require("cors");

const app = express();

app.use(express.json());
//app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// All bookings
app.get("/bookings", function (request, response){
  response.json(bookings);
})

//Create a new booking
app.post("/bookings", function(request, response){
  let newBooking = {
    id: 0,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: 0,
    checkInDate: request.body. checkInDate,
    checkOutDate: request.body.checkOutDate,

  };

 //Objects
 let  {title, firstName, surname, email, checkInDate, checkOutDate} = request.body;
  if(
    !title ||
    !surname ||
    !email ||
    !checkInDate ||
    !checkOutDate 
  ){
  
    response.status(400).send({message: "Please fill all of the fields"});
  }
  bookings.push(newBooking);
  newBooking.id = bookings.findIndex(newBooking) + 1;
  newBooking.roomId = newBooking.id + 10;

  response.json(bookings);
});
//Booking with Id
app.get("/bookings/:id", function(request, response){
  const searchedId = request.params.id;
  const searchResult = bookings.filter((booking) => booking.id == searchedId);
  response.json(searchResult);
});
//Delete a booking, specified by an ID
app.delete("/bookings/: id", function(request, response){
  const searchedId = request.params.id;
  const searchResult = bookings.filter((booking) => booking.id == searchedId);
  bookings.splice(index, 1);
  response.status(200).json({message:`Booking with id: ${searchedId} has been deleted successfully`});
});  
const PORT = process.env.PORT || 5000;

  app.listen(PORT,() => console.log(`Server started on port ${PORT}`));

