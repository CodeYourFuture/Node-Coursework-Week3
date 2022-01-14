const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// serve all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

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

  filteredBookings.length === 0
    ? res.status(404).json({
        success: false,
        message: `No booking was found to be containing '${term}'`,
      })
    : res.json({ success: true, booking: filteredBookings });
});

// serve one booking using an ID
app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filteredBooking = bookings.filter((booking) => booking.id === id);

  filteredBooking.length === 0
    ? res.status(404).json({
        success: false,
        message: `No booking with ID of ${id} was found`,
      })
    : res.json({ success: true, booking: filteredBooking });
});

const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
