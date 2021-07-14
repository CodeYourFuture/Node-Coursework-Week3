const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Main Route
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//  Bookings API Route
app.use('/bookings', require('./routes/api/bookings'));

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
