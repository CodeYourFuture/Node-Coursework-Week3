const express = require("express");
const cors = require("cors");
const appRouter = require("./routes/index.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(appRouter);

const { request, response } = require("express");

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
