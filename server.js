const express = require("express");
const cors = require("cors");
const app = express();
var moment = require('moment'); // require
moment().format(); 

let validator=require("email-validator");


app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//get all bookings
app.get("/bookings",function (request,response){
response.json(bookings);
});


function createId()
{
  let lastId= bookings[bookings.length-1].id;
  return lastId+1;
}


//this is a boolean function which will either return true or false depending
//on if the properties of the object. If there is an empty or missing property
//this funciton will return false;
function checkBooking(newBooking)
{
  
  console.log(newBooking)
  if(   newBooking.id 
     && newBooking.title 
     && newBooking.firstName 
     && newBooking.surname 
     && newBooking.email 
     && newBooking.roomId 
     && newBooking.checkInDate 
     && newBooking.checkOutDate)
    {
      return true
    }
  return false
}


app.post("/bookings",function(request,response){

  let newBooking=request.body;
  newBooking.id=createId();
  let checkIn=moment(newBooking.checkInDate);
  let checkOut=moment(newBooking.checkOutDate);

  let diff=checkOut.diff(checkIn,"days")

  if(checkBooking(newBooking) && diff > 0)
    {   
      bookings.push(newBooking);
      response.json(bookings);
    }
  else
    {
      if(diff<=0)
        response.send("Enter Valid checkin and checkout date")
        
      else
        response.send({status:400})
    }
});


//get by id
app.get("/bookings/:id",function(request,response){
  let {id}=request.params;
  let foundBooking=bookings.filter(booking=>id==booking.id);
  if(foundBooking!=[])
  response.json(foundBooking);
  else
    response.send({status:404})
})

//search by date
app.get("/search",function(request,response){
  let searchDate=request.query.date;
  let foundBooking=bookings.filter(booking=> booking.checkInDate==searchDate || booking.checkOutDate==searchDate)  
  
  if(foundBooking)  {
      response.json(foundBooking)
    }
  else{
      response.send({status:404})
    }
})




//delete
app.delete("/bookings/:id",function(request,response){
  let {id}=request.params;
  bookings=bookings.filter(booking=>booking.id!=id);
  
  let foundBooking=bookings.filter(booking=>id==booking.id);
  if(foundBooking)
  response.json(bookings);
  else
    response.send({status:404})
})


//get booking by email
app.get("/email",function(request,response){
 let searchEmail=request.query.email;
 let findEmail = bookings.filter(booking => booking.email.toLowerCase().includes(searchEmail.toLowerCase()));
 if(validator.validate(searchEmail)) {
   response.json(findEmail)
 }else{
   response.send({status:400})
 }
})



// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
