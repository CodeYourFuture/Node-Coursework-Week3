const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const { Pool } = require("pg");

const app = express();
const m = moment();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
//let bookings = require("./bookings.json");
const pool = new Pool({
  connectionString: process.env.PORT,
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels",
  password: "",
  port: 5432,
});
const { json } = require("express");
const res = require("express/lib/response");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  pool
    .query("SELECT * FROM bookings")
    .then((result) => res.json(result.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

app.get("/bookings/search", (req, res) => {
  const { date, term } = req.query;
  const bookingsFilteredByDate = bookings.filter((booking) => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    return moment(date).isBetween(checkInDate, checkOutDate);
  });
  const bookingsBySearchTerm = bookings.filter(
    (booking) =>
      booking.surname.toLowerCase().includes(term.toLocaleLowerCase()) ||
      booking.firstName.toLowerCase().includes(term.toLocaleLowerCase()) ||
      booking.email.toLowerCase().includes(term.toLocaleLowerCase())
  );
  if (term) {
    if (bookingsBySearchTerm.length === 0) {
      res.json({ msg: `No booking found with search term ${term}` });
    } else {
      res.json(bookingsBySearchTerm);
    }
  } else {
    if (bookingsFilteredByDate.length === 0) {
      res.json({ msg: `No booking found for ${date}` });
    } else {
      res.send(bookingsFilteredByDate);
    }
  }
});

app.get("/bookings/:id", (req, res) => {
  const requestedID = Number(req.params.id);
  pool
    .query(`SELECT * FROM bookings WHERE id = ${requestedID}`)
    .then((result) => {
      if (result.rowCount === 0)
        return res
          .status(404)
          .json({ msg: `Booking with id ${requestedID} not found.` });
      else return res.json(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

app.delete("/bookings/:id", (req, res) => {
  const requestedID = Number(req.params.id);
  pool
    .query(`DELETE FROM bookings WHERE id = $1`, [requestedID])
    .then((result) => {
      result.rowCount;
      if (result.rowCount === 0)
        return res
          .status(404)
          .json({ msg: `Booking with id ${requestedID} not found.` });
      else return res.json(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// app.delete("/customers/:id/bookings", (res, req))
// //customers/:id/bookings

app.post("/hotels", async (req, res) => {
  const { hotelName, hotelRooms, hotelPostcode } = req.body;
  const newHotel = {
    hotelName,
    hotelRooms: Number(hotelRooms),
    hotelPostcode,
  };
  try {
    const alreadyExist = await pool.query(
      "SELECT * FROM hotels WHERE name = $1",
      [hotelName]
    );
    console.log(alreadyExist);
    if (alreadyExist.rowCount)
      return res.status(400).json("A hotel with the same name already exist");
    else {
      const roomsValidator = hotelRooms && Number.isInteger(hotelRooms);
      const hotelNameValidator = hotelName && hotelName.length <= 120;
      const errorMessage = {};
      if (!roomsValidator)
        errorMessage = { msg: "incorrect input for number of rooms" };
      if (!hotelNameValidator)
        errorMessage = { msg: "incorrect input for hotel name" };
      if (Object.keys(errorMessage).length) {
        return res.status(400).json(errorMessage);
      }
      console.log(newHotel);
      try {
        const insertedRowHotels = await pool.query(
          `INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3) RETURNING id`,
          [newHotel.hotelName, newHotel.hotelRooms, newHotel.hotelPostcode]
        );

        return res.json({
          msg: `You have submitted new booking with id ${insertedRowHotels.rows[0].id}.`,
        });
      } catch (e) {
        console.log(e);
        res.status(400).json("Something went wrong");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json("Something went wrong");
  }
});

app.post("/bookings", async (req, res) => {
  const { customerId, hotelId, checkInDate, nights } = req.body;
  const newBooking = {
    customerId: Number(customerId),
    hotelId: Number(hotelId),
    checkInDate: checkInDate,
    nights: Number(nights),
  };
  const dateValidator = new Date(newBooking.checkInDate).getTime() > 0;
  const compulsoryFields = Object.keys(newBooking);
  const allKeysArePresent = compulsoryFields.every((key) => {
    return Object.keys(req.body).includes(key);
  });
  const errorMessage = {};
  if (!allKeysArePresent) {
    errorMessage.msgMissingKey = "Some information is missing";
  }
  if (!dateValidator) {
    console.log(newBooking.checkInDate);
    errorMessage.msgInvalidDate = "Invalid date";
  }
  if (Object.keys(errorMessage).length) {
    return res.status(400).json(errorMessage);
  }

  try {
    const insertedRow = await pool.query(
      `INSERT INTO bookings (customer_id, hotel_id, checkin_date, nights) VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        newBooking.customerId,
        newBooking.hotelId,
        newBooking.checkInDate,
        newBooking.nights,
      ]
    );
    console.log(insertedRow);
    return res.json({
      msg: `You have submitted new booking with id ${insertedRow.rows[0].id}.`,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json("Something went wrong");
  }
});
// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("your app is listening on port " + PORT);
});
