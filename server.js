const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
 app.get("/bookings", (request,response) => {
  !bookings ? response.status(400).json({error:true, message:"there is an error!"}) :
  response.status(200).json({success:true, data:bookings })
 });

 app.get("/bookings/:id", (request,response) => {
  let bookingId= request.params.id

  if(bookingId){
    return response.status(400).json({error:true, message:"there is an error!"})
  };

  let findingBooking=bookings.find(booking => booking.id===+bookingId)

  !findingBooking ?response.status(404).json({success:false, message:"there is no booking with this id"}) ://which error status is correct for this kind of response??????
  response.status(200).json({success:true, data:findingBooking })
 });

 app.delete("/bookings/:id", (request, response) => {
  let bookingId = request.params.id;
  if (!bookingId){
    return response.status(400).json({error:true, message:"there is an error!"})
  }
  let bookingToDelete = bookings.find(booking => booking.id === +bookingId);
  let indexOfMessageToDElete= bookings.indexOf(bookingToDelete);
  bookings.splice(indexOfMessageToDElete,1)
  response.status(200).json({success:true, data:bookings })
 });

app.post("/bookings", (request, response) =>{
  //const { id, title, firstName, surname, email, roomId, checkInDate, checkOutDate} = request.body;
  bookings.push(request.body)
  response.status(200).json({success:true , data: bookings})
})

const listener = app.listen(3001, function () {
  console.log("Your app is listening on port 3001 ");
});
