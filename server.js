const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());



//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.sendFile(__dirname +"/index.html");
});

// app.post("/",(req, res)=>{

  
//   let ID= bookings.length;
//   const newBooking = {
//     id : ID,
//     roomID: req.body.roomID,
//     title : req.body.title ,                  
//     firstName : req.body.firstName,  
//     surname: req.body.surname,
//     email :req.body.email, 
//     checkInDate : req.body.checkInDate,
//     checkOutDate : req.body.checkOutDate
//     };
//     bookings.push(newBooking)
//     res.send(bookings);
  
   
  
//   });

 app.post("/bookings",(req,res)=>{
  
  if( !req.body.roomId  || !req.body.title  ||!req.body.firstName  ||
    !req.body.surname  ||!req.body.checkInDate  ||!req.body.checkOutDate   ){
      res.status(400).send("not valid input");
    } else{
      let ID= bookings.length;
  const newBooking = {
    id : ID,
    roomId: req.body.roomId,
    title : req.body.title ,                  
    firstName : req.body.firstName,  
    surname: req.body.surname,
    email :req.body.email, 
    checkInDate : req.body.checkInDate,
    checkOutDate : req.body.checkOutDate
    };
    bookings.push(newBooking)
    res.send(bookings);
  
   

    }

 });




app.get("/bookings",(req, res)=>{
  res.send(bookings);
});

app.get('/bookings/search/:id',(req, res)=>{
  const filterId = req.params.id;
  //console.log(filterId);
  
   const  filteredBookings = bookings.filter(booking =>{
       return booking.id === Number(filterId);
      console.log(filteredBookings);
    
    
  })
      res.json(filteredBookings);
});

app.delete("/bookings/search/:id", (req, res) => {
  const filterId = req.params.id;
  //console.log(Number(filterId));
   

  const filteredBookings = bookings.filter(booking => {

    return booking.id === Number(filterId);
    
  });

  console.log(filteredBookings +">>>>>>>>>>");
  const remainingBookings = bookings.filter(booking=>{
   // console.log(filteredBookings.id);
   return booking.id !== Number(filteredBookings[0].id);
  });
  
  //console.log(remainingBookings);
  res.send(remainingBookings);
 
});



  
   




// TODO add your routes and helper functions here
const port = process.env.PORT|| 3000;

const listener = app.listen(port, function(){
  console.log("Your app is listening on port " + listener.address().port);
});
