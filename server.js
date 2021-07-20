const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const moment = require("moment");


const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/",  (request, response) => {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// get all bookings

  app.get("/bookings", (req, res) => {
    res.status(200);
    res.send(bookings);
  });

  // Search by booking
  app.get("/booking/search", (req, res) => {
    const { date } = req.query;

    if (date == null) {
      next();
      return;
    }

    const result = bookings.filter((bookings) => {
      console.log(moment(date).isBetween(bookings.checkInDate, bookings.checkInDate)
      )
    })
    res.send(result);
  });

  //  search for all bookings

  app.get("/bookings/search", (req, res, next) => {
    const term = req.query.term?.toLowerCase(); // ?. - if term is nullish it returns undefined without causing an error
  
    if (term == null) {
      res.status(404).send("oops");
      return;
    }
  
    const result = bookings.filter((booking) => {
      return (
        booking.firstName.toLowerCase().includes(term) ||
        booking.surname.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term)
      );
    });
  
    res.send(result);
  });




















const listener = app.listen(process.env.PORT || 3000,   () => {
  console.log("Your app is listening on port " + listener.address().port);
});

