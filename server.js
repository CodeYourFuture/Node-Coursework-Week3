const express = require("express");
const cors = require("cors");
const bookingRouter = require("./bookingRouter");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.use("/booking", bookingRouter);

const PORT = process.env.PORT || 3000;

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
