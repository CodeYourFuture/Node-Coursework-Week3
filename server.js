// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(express.json());
// app.use(cors());

// //Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });

// // TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = 3001;

// // Use this array as your (in-memory) data store.
// const bookings = require("./bookings.json");

// app.use(express.json());
// app.use(cors());

// // Helper functions

// const getBookingById = (id) => {
//   return bookings.find((booking) => booking.id == id);
// };

// const deleteBookingById = (id) => {
//   const index = bookings.findIndex((booking) => booking.id == id);
//   if (index !== -1) {
//     bookings.splice(index, 1);
//     return true;
//   }
//   return false;
// };

// const createBooking = (booking) => {
//   const newBooking = {
//     id: bookings.length + 1,
//     ...booking,
//   };
//   bookings.push(newBooking);
//   return newBooking;
// };

// // Routes

// app.get("/bookings", (req, res) => {
//   res.json(bookings);
// });

// app.get("/bookings/:id", (req, res) => {
//   const id = req.params.id;
//   const booking = getBookingById(id);
//   if (booking) {
//     res.json(booking);
//   } else {
//     res.status(404).send("Booking not found");
//   }
// });

// app.post("/bookings", (req, res) => {
//   const booking = req.body;
//   const newBooking = createBooking(booking);
//   res.json(newBooking);
// });

// app.delete("/bookings/:id", (req, res) => {
//   const id = req.params.id;
//   const deleted = deleteBookingById(id);
//   if (deleted) {
//     res.send("Booking deleted");
//   } else {
//     res.status(404).send("Booking not found");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });


const express = require("express");
const router = express.Router();

// Use this array as your (in-memory) data store.
const bookings = [];

// Helper functions

const getBookingById = (id) => {
  return bookings.find((booking) => booking.id == id);
};

const deleteBookingById = (id) => {
  const index = bookings.findIndex((booking) => booking.id == id);
  if (index !== -1) {
    bookings.splice(index, 1);
    return true;
  }
  return false;
};

const createBooking = (booking) => {
  const newBooking = {
    id: bookings.length + 1,
    ...booking,
  };
  bookings.push(newBooking);
  return newBooking;
};

// Routes

router.get("/", (req, res) => {
  res.json(bookings);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const booking = getBookingById(id);
  if (booking) {
    res.json(booking);
  } else {
    res.status(404).send("Booking not found");
  }
});

router.post("/", (req, res) => {
  const booking = req.body;
  const newBooking = createBooking(booking);
  res.json(newBooking);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteBookingById(id);
  if (deleted) {
    res.send("Booking deleted");
  } else {
    res.status(404).send("Booking not found");
  }
});

module.exports = router;
