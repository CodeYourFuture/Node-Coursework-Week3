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
      Title: Joi.string().min(2).required(),
      FirstName: Joi.string().max(50).required(),
      Surname: Joi.string().max(50).required(),
      Email: Joi.string().email().required(),
      RoomId: Joi.number().integer().min(1).required(),
      CheckInDate: Joi.date().iso().required(),
      CheckOutDate: Joi.date().iso().greater(Joi.ref("CheckInDate")).required(),
    });

    const result = schema.validate(req.body);

    const {
      Title,
      FirstName,
      Surname,
      Email,
      RoomId,
      CheckInDate,
      CheckOutDate,
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


// Delete a booking by id
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookingToDelete = bookings.findIndex((booking) => {
    return booking.id === id;
   
  });

  if (bookingToDelete !== -1) {
    bookings.splice(bookingToDelete, 1);
    res.status(200).send(`Deleted booking with id: ${id}`);
  } else {
    res.status(404).send("Not found");
  }
});

// Search by date

app.get("/bookings/search", (request, response) => {
  const date = request.query.date;
  const bookingsIndDate = bookings.filter(
    (booking) =>
        moment(date).isBetween(
        booking.checkInDate,
        booking.checkOutDate
      ) 
  );
  bookingsIndDate.length === 0
    ? response.status(400).send({
        msg: `There is nobody on date ${request.query.date}`,
      })
    : response.send(bookingsIndDate);
});


const listener = app.listen(process.env.PORT || 3000,   () => {
  console.log("Your app is listening on port " + listener.address().port);
});