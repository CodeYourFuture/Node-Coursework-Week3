const express = require("express");
const cors = require("cors");

const app = express();
var moment = require('moment'); 
moment().format();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//////////////creat a new booking ///////////////
app.post('/bookings',  (req, res) => {

  let newId = bookings[bookings.length -1].id + 1
  let newRoomId = bookings[bookings.length -1].id + 1
let newBooking = {
  id : newId, 
  title : req.body.title,
  firstName: req.body. firstName,
  surname : req.body.surname ,
  email : req.body.email ,
  roomId : newRoomId,
  checkInDate : req.body.checkInDate,
  checkOutDate :req.body.checkOutDate
  
  }
  if((newBooking.checkInDate !== undefined)&&(newBooking.checkInDate.length >0) && (newBooking.checkOutDate!== undefined)&&(newBooking.checkOutDate.length >0)&&(newBooking.title !== undefined)&&(newBooking.title.length >0)&& (newBooking.firstName !== undefined)&&(newBooking.firstName.length >0) && (newBooking.surname !== undefined)&&(newBooking.surname.length >0)&& (newBooking.email !== undefined)&&(newBooking.email.includes("@"))&& (moment(newBooking.checkOutDate).isAfter(newBooking.checkInDate))){
    bookings.push(newBooking);
  // res.send("added")
res.send("added")
}
    else{
      res.send("wrong request")
    }
  }
);
//////////////////read all booking /////////////////////////////////////////////////
app.get('/bookings',  (req, res) => {
  res.send(bookings)})
  //////////////////// Read one booking, specified by an ID//////////////////////////
  app.get('/bookings/:id',  (req, res) => {
    const bookingId = Number(req.params.id)
    const requiredBooking = bookings.find(b => b.id === bookingId)
    if(requiredBooking !==undefined){
      res.send(requiredBooking)
    }
    else{
      res.status(404).send(" Booking does not exist, please check your information and try again")
    }
   })
   ////////////////// Delete a booking, specified by an ID ///////////////////////////////
   app.delete('/bookings/:id',  (req, res) => {
    const bookingId = Number(req.params.id)
    const index = bookings.findIndex(b => b.id === bookingId)
    console.log(index);
    if(index !== undefined){
      bookings.splice(index ,1)
      res.send("deleted successfully")
    }
    else{
      res.status(404).send("Something wrong happened with deleting the booking ")
    }
   })
   /////////////////////////level 3 optional //////////////////////////
   app.get("/bookings/search", function (req, res) {
    const target =req.query.date
      const result = bookings.find(word => (moment(word.checkInDate).isSame(target) || moment(word.checkOutDate).isSame(target)))
      if(result){
      res.send(result);

    }                                                  /////////not working I don't know why //////////////////////////////
    else {
      res.send([])
    }
  }); 
  ///////////////////////////level 4 optional /////////////////
  //////// validate email ?/////
   ////////////////////// level 5 optional /////////////////////////
   app.get("/bookings/search", function (req, res) {
    const target = req.query.term
    
      const result = bookings.filter(word => (word.firstName.toLowerCase().includes(target.toLowerCase())) || (word.surname.toLowerCase().includes(target.toLowerCase())) ||  (word.email.toLowerCase().includes(target.toLowerCase())))
      console.log(result);
      if (result != undefined) {
      res.send(result);
    }
    else {
      res.send([])
    }
  });
  
const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
// app.listen(3001, ()=>{
//   console.log("your port is 3001");
// })
