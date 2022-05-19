const express = require("express");
const cors = require("cors");
const bookings = require("./routes/bookings");

const app = express();

const port = process.env.PORT || 8090;

app.use(express.json());
app.use(cors());

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.use("/bookings", bookings);

app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
