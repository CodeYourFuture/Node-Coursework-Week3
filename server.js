const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

/* sends a response based on the length of the passed booking array
  @param {array} booking - filtered booking array derived from bookings 
  @param {object} res - the response object returned from the app HTTP methods
  @returns {undefined} */
const sendResponse = function (booking, res) {
  booking.length === 0
    ? res.status(404).json({
        success: false,
        message: `No booking was found.`,
      })
    : res.json({ success: true, booking });
};

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// serve all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// serve an array of bookings based on a search term query. This query can match anything from within the object
app.get("/bookings/search", (req, res) => {
  const { term } = req.query;
  if (!term)
    res
      .status(404)
      .send({ success: false, message: "No term query specified" });

  const filteredBookings = bookings.filter((booking) => {
    for (let key in booking) {
      if (String(booking[key]).toLowerCase().includes(term.toLowerCase())) {
        return booking;
      }
    }
  });

  sendResponse(filteredBookings, res);
});

// serve one booking using an ID
app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filteredBooking = bookings.filter((booking) => booking.id === id);

  sendResponse(filteredBooking, res);
});

// delete a booking based on ID
app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundIndex = bookings.findIndex((booking) => booking.id === id); // returns -1 if the ID isn't found

  if (foundIndex === -1)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });

  const removedBooking = bookings.splice(foundIndex, 1);
  res.json({
    success: true,
    "removed booking": removedBooking,
    bookings: bookings,
  });
});

// create a new booking
app.post("/bookings", (req, res) => {
  const payloadData = req.body;

  for (let key in payloadData) {
    if (typeof payloadData[key] === "number") {
      if (!payloadData[key]) {
        return res.status(404).json({
          success: false,
          message: "Cannot make new booking as you are missing some data",
        });
      }
    } else if (!payloadData[key].trim()) {
      return res.status(404).json({
        success: false,
        message: "Cannot make new booking as you are missing some data",
      });
    }
  }

  bookings.push({
    id: bookings.length === 0 ? 1 : bookings[bookings.length - 1].id + 1,
    ...payloadData,
  });
  res.json({ success: true, bookings: bookings });
});

const listener = app.listen(3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
