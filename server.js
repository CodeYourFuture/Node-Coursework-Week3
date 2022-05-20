const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Create a new booking

app.post("/booking/add", (req, res) => {
  const { title, firstName, surNme, email, roomId, checkInDate, checkOutDate } = req.body;

  const newBooking = {
    id: bookings.length + 1,
    title: title,
    firstName: firstName,
    surname: surname,
    email: email,
    roomId: roomId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate
	};

  bookings.push(newBooking);
  res.send(bookings);
});

// 
app.put("/booking/put/:id", (req, res)=> {
	const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = req.body;

	bookings = bookings.map(booking => {
		if(booking.id == req.params.id)
			return {
				id: booking.id,
				title: title || booking.title,
				firstName: firstName || booking.firstName,
				surname: surname || booking.surname,
				email: email || booking.email,
				roomId: roomId || booking.roomId,
				checkInDate: checkInDate || booking.checkInDate,
				checkOutDate: checkOutDate || booking.checkOutDate
			};
		return booking;
	});

	res.status(200);
	res.send(bookings);
});


// Read all bookings
app.get("/bookings", (request, response) => {
  res.status(200)
  response.send(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
const bookingsById = bookings.filter(booking => booking.id == req.params.id);

if(!bookingsById.length) 
{
  res.status(404);
  res.send("Cannot find this booking :' (Try id number")
}
res.status(200);
res.send(bookingsById);

});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const foud = bookings.find(booking => bookingroomId == id);

  if(!found)
  {
    res.status(404);
    res.send("Cannot find that booking :'( ");
  }

  bookings = bookings.filter(booking => parseInt(booking.id ==id));
  res.status(200);
  res.send(bookings);
});



// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
