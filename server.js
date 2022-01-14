const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

/* sends a response based on the length of the passed booking array
  @param {array} booking - filtered booking array derived from bookings 
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

const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
