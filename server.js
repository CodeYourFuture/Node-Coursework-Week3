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

// TODO add your routes and helper functions here
//Read all bookings and create new booking
app.route("/bookings").get((req, res) => {
	res.json(bookings);
}).post((req, res)=>{
	const {newBooking} = req.body;
	if(newBooking){
	bookings.push(newBooking);
	res.json({success:true, bookings});
	}else{
		res.status(400).json({success:false, msg:`Error! No data found`});
	}
})

//Read one booking by Id and delete by Id
app
	.route("/bookings/:bookingIdStr")
	.get((req, res) => {
		const { bookingIdStr } = req.params;
		const bookingId = parseInt(bookingIdStr);
		if (bookings.some((booking) => booking.id === bookingId)) {
			const match = bookings.filter((booking) => booking.id === bookingId);
			res.json(match);
		} else {
			res.status(404).json({ msg: `No booking with id of: ${bookingId}` });
		}
	})
	.delete((req, res) => {
		const { bookingIdStr } = req.params;
		const bookingId = parseInt(bookingIdStr);
		if (bookings.some((booking) => booking.id === bookingId)) {
			const filteredBookings = bookings.filter(
				(booking) => booking.id !== bookingId
			);
			res.json({ success: true , filteredBookings});
		} else {
			res
				.status(404)
				.json({ success: false, msg: `No booking for id: ${bookingId}` });
		}
	});

const listener = app.listen(process.env.PORT, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
