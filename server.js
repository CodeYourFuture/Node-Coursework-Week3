const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/bookings-routes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", bookingRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is live on port: " + (process.env.PORT || 5000));
});
