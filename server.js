const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const app = express();
const port =process.env.PORT|| 3002;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});
// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

// TODO add your routes and helper functions here
app.get('/bookings', function(request, response) {
  
  response.json(bookings)

});
//create new booking
app.post('/bookings',[check('email').isEmail(),],  (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })}
  let booking={
    id:bookings.length+1,
    title:req.body.title ,
    firstName:req.body.firstName,
    surname:req.body.surname,
    email:req.body.email,
    roomId:Number(req.body.roomId),
    checkInDate:new Date(req.body.checkInDate),
    checkOutDate:new Date(req.body.checkOutDate)
  }
  
  console.log(booking.checkOutDate);
  console.log(booking.checkInDate.toLocaleDateString());
  if (booking.checkOutDate>booking.checkInDate){
    booking.checkInDate=booking.checkInDate.toLocaleDateString();
    booking.checkOutDate=booking.checkOutDate.toLocaleDateString()
  if (booking.title.length>0 && booking.firstName.length>0 
    && booking.surname.length >0 && booking.email.length>0
    && booking.roomId>0
    && booking.checkInDate.length>0&&booking.checkOutDate.length>0
    
   
    )
  {
    
bookings.push( booking);
  res.json(bookings);
}
  else
    res.status(400).send(" please enter a value for all inputs")}
    else
    res.status(400).send(" please enter a resonable dates") 
});

// reading booking specified by id
app.get('/bookings/:bookingId',  (req, res) => {
  const bookingId= req.params.bookingId;
  const booking = bookings.find(b=> b.id === parseInt(bookingId));
  if(booking){
  res.json(booking);
  

  }
  else
    res.status(404).send(" wrong request")
});

// Delete a booking
app.delete('/bookings/:booking_Id',  (req, res) => {
  const bookingId = Number(req.params.booking_Id);
  let requiredIndex=bookings.findIndex(b=>b.id===bookingId);
  if(requiredIndex>=0){
  bookings.splice(requiredIndex,1)
  res.json(bookings);
  }
  else {
    res.status(404).send("wrong request")
  }

})
// searching

function searchDatefun(date) {
  console.log((new Date (date).toLocaleDateString()));
  return bookings.filter(booking => new Date(booking.checkInDate).toLocaleDateString()===(new Date(date).toLocaleDateString())||new Date(booking.checkOutDate).toLocaleDateString()===(new Date(date).toLocaleDateString()));
}

app.get("/bookings1/search", function(request, response) {
  const searchDate = new Date(request.query.date).toLocaleDateString();
  console.log((searchDate))
  const result = searchDatefun(searchDate );
  if(result)
  response.send(result);
  else {
    response.status(400).send("No matching results")
  }
});
function search(word) {
  return bookings.filter(booking => booking.firstName.toLowerCase().includes(word.toLowerCase())
  ||booking.surname.toLowerCase().includes(word.toLowerCase())
  ||booking.email.toLowerCase().includes(word.toLowerCase()));
}

app.get("/bookings2/search", function(request, response) {
  const searchWord = request.query.term;
  const result = search(searchWord);
  if(result)
  response.send(result);
  else {
    response.status(400).send(" No matching results")
  }
});
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
