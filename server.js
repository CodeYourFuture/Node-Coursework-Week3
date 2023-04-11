const express = require("express");
const cors = require("cors");

const app = express();
const port = 3003;
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");




app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//Create a new booking
app.post("/bookings",(request,response)=>{
  if(!request.body) {
      return response.status(400).send({
          message: "Booking content can not be empty"
      });
  }
  const booking = {
    "id": 12,
    "title": "Mr",
    "firstName": "roozbeh",
    "surname": "shokri",
    "email": "roozbeh@example.com",
    "roomId": 12,
    "checkInDate": "2022-11-21",
    "checkOutDate": "2023-11-23"
  };
  
        //Add the new booking to the array
        bookings.push(booking);

        //Send the bookings array as a response
        response.send(bookings);
    });

    
    
    //Read all bookings
  app.get('/bookings',(req,res)=>{
  res.json(bookings);
});

//Read one booking, specified by an ID
app.get('/bookings/:id',(req,res)=>{
  const id = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === id);

  //If booking is not found, return 404
  if(!booking) {
      return res.status(404).send({
          message: "Booking not found with id " + req.params.id
      });
  }
      //Send the booking as a response
      res.send(booking);
    });

    //Delete a booking, specified by an ID
  app.delete('/bookings/:id',(req,res)=>{
  const id = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === id);
  //If booking is not found, return 404
  if(!booking) {
      return res.status(404).send({
          message: "Booking not found with id " + req.params.id
      });
  }

  //Delete the booking
  const index = bookings.indexOf(booking);
  bookings.splice(index,1);
 //Send the bookings array as a response
  res.send(bookings);
});

// const listener = app.listen(process.env.PORT, function () {
  // console.log("Your app is listening on port " + listener.address().port);
  
// });
app.listen(port, function(){
  console.log("go to this port 3003");
});

