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
app.get("/booking", function (request, response) {
  response.send(bookings);
})

// Create a new booking
app.post("/bookinng",(request,response)=> {
  if(!request.body) {
    return response.status(400).send( {
      message: "Booking content can not be empty"

    });
  }
// Check if any property of the booking object is missing or empty
if(!request.body.name || !request.body.date || !request.body.room) {
  return response.status(400).send( {
    message: " Name, Date, and room are required"

  });
}



// TODO add your routes and helper functions here


// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
  
const booking = { 
  "id": 6,
    "title": "Mrs",
    "firstName": "Heni",
    "surname": "MKH",
    "email": "Heni@example.com",
    "roomId": 6,
    "checkInDate": "20123-03-21",
    "checkOutDate": "2023-03-27"
  };
  

// Add the new booking to the array
bookinng.push(bookinng);


//Send the bookings array as a response
response.send(bookings);
});

 //Read all bookings
 app.get('/booking/:id',(req,res)=> {
  const id = parseInt(req.params.id);
  const booking = booking.find(b => b.id === id);

  //If booking is not found, return 404
  if (!booking) {
    return res.stutus(404).send({
      message: "Booking not found with id " + req.params.id
    });
  }

    //Send the booking as a response
    res.send(booking);

 });

 //Delete a booking, specified by an ID
 app.delete('/bookinng/:id',(req,res)=>{
  const id = parseint(req.params.id);
  const booking = booking.find(b => b.id === id);

   //If booking is not found, return 404
   if (!booking) {
    return res.stutus(404).send({
      message: "Booking not found with id" + req.params.id
    });
   }

 //Delete the booking
 const index = bookings.indexOf(booking);
 booking.splice(index,1);
 //Send the bookings array as a response
 res.send(bookings);
})

app.get('/booking/search',(req,res)=> {
  const date = req.quary.date;

  //Check if date is provided
  if (!date) {
    return res.status(400).send({
      message: "Date is required"
    });
  }
 //Filter the bookings array
 const bookingsSpanDate = booking.filter(b => b.date ==date);
 res.send(bookingsspanDate);

});

app.listen(port, function() {
  console.log("go to this port 3003")
});
