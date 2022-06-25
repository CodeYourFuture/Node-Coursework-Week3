const express = require("express");
const cors = require("cors");
// const moment = require("moment");
const app = express();
const { Pool } = require("pg");

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//search query should always be at the top 
app.get("/bookings/search", (req, res) => {
  const date = req.query.date;
  const term = req.query.term;

  const result = bookings.filter((booking) => {
      return (
        booking.checkInDate === date||
        booking.checkOutDate === date ||
        booking.email.includes(term) ||
        booking.firstName.includes(term) ||
        booking.surname.includes(term)
      );
  });
  console.log(result)
  !result ?  res.status(404).send(`Sorry, no bookings found`) : res.json(result);
});


app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// add bookings
let id = 6;
app.post("/bookings", (request, response) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return response.sendStatus(404);
  }
  bookings.push({ ...request.body, id: id++ });
  return response.sendStatus(201);
});

//export DATABASE_URL=postgres://mohammad:8808@localhost:5432/cyf_hotels?sslmode=disable
//export DATABASE_URL=postgres://nrbwnbfxjwtqna:466572b6529bb67e4ad9a605133e8cb3d49e07b04399e2b89fbea55fddde2398@ec2-54-77-40-202.eu-west-1.compute.amazonaws.com:5432/dc5jjgn7tuaqps

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// bookings api
app.get("/customers", (req, res) => {
  pool
  .query('SELECT * FROM customers')
  .then((result) => res.json(result.rows))
});

// get bookings by ID
app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find(
    (booking) => booking.id === Number(req.params.id)
  );
  !findById ? res.status(404).send("No Id found!") : res.send(findById);
});

// delete bookings by ID
app.delete("/bookings/:id", (req, res) => {
  const deleteById = bookings.findIndex(
    (booking) => booking.id === Number(req.params.id)
  );
  bookings.splice(deleteById, 1);
  deleteById === -1 ? res.sendStatus(404) : res.sendStatus(200).send();
});


// const pool = new Pool({
//   user: "mohammad",
//   host: "localhost",
//   database: "cyf_ecommerce",
//   password: "8808",
//   port: 5432,
// });


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 9999, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
