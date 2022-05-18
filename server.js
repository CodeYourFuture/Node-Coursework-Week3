const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let id =6
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/bookings", (req, res) => {
  // res.send.apply("  ")
  bookings.push({ ...req.body, "id": id++ });

  console.log(bookings);
  res.sendStatus(201)

});

app.get("/bookings", (req, res) => {
  res.send(bookings)
});

app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find((booking) => booking.id === Number(req.params.id))
  if (!findById) res.sendStatus(404);
  res.send(findById);
});

app.delete("/bookings/:id", (req, res) => {
  const deleteById = bookings.findIndex(
    (booking) => booking.id === Number(req.params.id)
  );
  bookings.splice(deleteById, 1);
   if (deleteById === -1) res.sendStatus(404);
  res.sendStatus(200).send();
  
  });




// TODO add your routes and helper functions here

const listener = app.listen(9001, ()=> {
  console.log("Your app is listening on port " + listener.address().port);
});
