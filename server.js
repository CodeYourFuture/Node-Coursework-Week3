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


// Get one booking by id
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const foundBooking = bookings.find((booking) => {
    return booking.id === id;
    // returns element || undefined
  });

  foundBooking !== undefined
    ? res.status(200).send(foundBooking)
    : res.status(404).send(`There is no booking with id ${id}`);
});


// Create a new booking
  app.post("/bookings", (req, res) => {
    const schema = Joi.object({
      title: Joi.string().min(2).required(),
      firstName: Joi.string().max(50).required(),
      surname: Joi.string().max(50).required(),
      email: Joi.string().email().required(),
      roomId: Joi.number().integer().min(1).required(),
      checkInDate: Joi.date().iso().required(),
      checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).required(),
    });

    const result = schema.validate(req.body);

    const {
      title,
      firstName,
      surname,
      email,
      roomId,
      checkInDate,
      checkOutDate,
    } = req.body;

    const generateRandomId = () => Date.now(); // id for the new booking

    const newBooking = {
      id: generateRandomId(),
      Title,
      FirstName,
      Surname,
      Email,
      RoomId,
      CheckInDate,
      CheckOutDate,
    };

    if (result.error) {
      res.status(400).send(result.error.details[0].message);
    } else {
      bookings.push(newBooking);
      res.status(200).send(bookings);
    }
  });


















const listener = app.listen(process.env.PORT || 3000,   () => {
  console.log("Your app is listening on port " + listener.address().port);
});

