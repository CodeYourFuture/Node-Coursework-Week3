const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.post("/bookings", function(req, res){
  const addBooking = req.body;
  if(addBooking.length > 0){
bookings.push(addBooking)
res.send({success: true})}
else{
  res.send("please enter value")
}
}) 

app.get("/bookings", function(req, res){
  res.send(bookings)
})

app.get("/bookings/:id", function(req, res){
let bookingId = Number(req.params.id)
res.send(bookings.find(booking => {
return booking.id === bookingId
} ))
})

app.delete("/bookings/:id", function(req, res){
let bookingId = Number(req.params.id)
bookings = bookings.filter(booking => {
 return booking.id !== bookingId

})
res.send(bookings)
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
