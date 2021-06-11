const express = require("express");
const cors = require("cors");

const app = express();
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(cors());


//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function(request, response){
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


// TODO add your routes and helper functions here
app.get('/bookings', (req, res) => {
  res.json(bookings)
})

app.get('/bookings/:id', (req, res) => {
  // let bookingId = req.params.id;
  const requestedBooking = bookings.filter(booking => booking.id === parseInt(req.params.id))
  if (requestedBooking.length === 0) {
    res.json(`There isn't a booking with the ID ${req.params.id}`);
  } else {
    res.json(requestedBooking)
  }
})

app.post('/bookings', 
         body('roomId').isLength({ min: 1 }), 
         body('title').isLength({min: 2}), 
         body('firstName').isLength({min: 2}),
         body('surname').isLength({min: 2}),
         body('email').isEmail(),
         body('checkInDate').isLength({min: 8}),
         body('checkOutDate').isLength({min: 8}),
         (req,res) => {
  
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      let idNum = bookings.length;
      idNum++;
      const newBooking = {
        id:	idNum,
        roomId: req.body.roomId,
        title:	req.body.title,
        firstName: req.body.firstName, 
        surname: req.body.surname,
        email: req.body.email,
        checkInDate: req.body.checkInDate,
        checkOutDate: req.body.checkOutDate	
      }
      bookings.push(newBooking);
      res.json(newBooking);
    }
});

app.delete('/bookings/:bookingId', (req, res) => {
  const found = bookings.filter(booking => booking.id === parseInt(req.params.bookingId))
  if (found) {
    let foundIndex = bookings.indexOf(found)
    bookings.splice(foundIndex,1)
    res.json(bookings);
  } else {
    res.json(`There isn't a booking with the id "${req.params.bookingId}"`)
  }
})

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
