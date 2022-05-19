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

let id =6
app.post("/bookings", (req, res) => {
  const {title, firstName, surname, email, roomId, checkInDate, checkOutDate}= req.params
  if (!title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate) {
    return res.sendStatus(404);
  }
  bookings.push({ ...request.body, id: id++ });
  return res.sendStatus(201);
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
