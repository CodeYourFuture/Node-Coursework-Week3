const express = require("express");
const cors = require("cors");
const lodash = require("lodash");
const app = express();
const uuid = require('uuid');
const moment = require("moment");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
//let counter = 6;
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


//Read all bookings
app.get("/bookings", function(req, res){
  res.json(bookings);
});


//create new booking
app.post("/bookings", (req, res) => {
   //const newBooking = req.body;


   const newBooking = {
    //id: lodash.uniqueId("1"),
    id:uuid.v4(),
    title: req.body.title.trim(),
    firstName: req.body.firstName.trim(),
    surname: req.body.surname.trim(),
    email: req.body.email.trim(),
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate.trim(),
    checkOutDate: req.body.checkOutDate.trim(),
  };

  if (newBooking.id
  && newBooking.title
  && newBooking.firstName
  && newBooking.surname
  && newBooking.email
  && newBooking.roomId 
  && newBooking.checkInDate 
  && newBooking.checkOutDate) { 

   bookings.push(newBooking);
    res.send({message: "New booking is successfully added"})
  } else {
    res.status(400);
    res.json({message: "Booking failed! Please fill all the required fields."})
  }

});


//search by date
app.get("/bookings/search", (req, res) => {
  const searchedDate = moment(req.query.date);
  const searchResult = bookings.find(booking => {
    const startDate = moment(booking.checkInDate);
    const endDate = moment(booking.checkOutDate);
    return searchedDate.isBetween(startDate, endDate) || searchedDate.isSame(startDate) || searchedDate.isSame(endDate);
  });
  if (searchResult) res.json(searchResult);
  else res.status(400).json({message: `${searchedDate}!`})
});

//Find the booking by ID 
app.get("/bookings/:id",(req,res)=>{
  const id= req.params.id;
  const bookingId = bookings.find(booking =>booking.id.toString() === id);
  if(id && bookingId){
    res.json(bookingId);
  } else{
    res.status(404).send({message:`A booking by ID ${id} does not exist`});
  }

});




//Delete Bookings
app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const DeleteBooking = bookings.findIndex(booking => booking.id.toString() === id);
  if (id && DeleteBooking) {
    console.log(DeleteBooking,id);
    bookings.splice(DeleteBooking, 1);
    res.json({message: `A booking by the ID ${id} is successfully deleted!`});
  }
  else res.status(404).send({message: `A booking by the ID ${id} does not exist.`})
})



// create new post
// app.post("/newbooking", (request, response) => {
//   const newPost = {
//    id: counter,
//     //id: uuid.v4(),
//     from: request.body.from,
//     text: request.body.text,
//     timeSent: new Date(),
//   }
//     counter++

//   if(!request.body.from || !request.body.text){
//    // response.status(400).json({msg:"please include name and message"});
//     response.send("required fields must not ber empty!!!");
//   }  else {
//     messages.push(newPost);    
//     //response.status(201);
//     response.send(messages); 
//   }      
// });
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
