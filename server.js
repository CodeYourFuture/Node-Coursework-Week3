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
 //Check if any property of the booking object is missing or empty
 if(!request.body.name || !request.body.date || !request.body.room) {
  return response.status(400).send({
      message: "Name, date, and room are required"
  });

 }
  


  const booking = {
    "id": 12,
    "title": "Mr",
    "firstName": "Hadi",
    "surname": "A.P",
    "email": "hadi.allah@yahoo.com",
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


app.get('/bookings/search',(req,res)=>{
  const date = req.query.date;

  //Check if date is provided
  if(!date) {
      return res.status(400).send({
          message: "Date is required"
      });
  }

  //Filter the bookings array
  const bookingsSpanDate = bookings.filter(b => b.date == date);

  //Send the filtered bookings array as a response
  res.send(bookingsSpanDate);
});

// const listener = app.listen(process.env.PORT, function () {
  // console.log("Your app is listening on port " + listener.address().port);
  
// });
app.listen(port, function(){
  console.log("go to this port 3003");
});

