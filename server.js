const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

// Dayjs
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// Dayjs

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

//Use this array as your (in-memory) data store.
let bookings = require('./bookings.json');

app.get('/', function (request, response) {
	response.send('Hotel booking server.  Ask for /bookings, etc.');
});

app.get('/bookings', (req, res) => {
	res.status(200).send(bookings);
});

app.post('/bookings', (req, res) => {
	if (
		req.body.title.length === 0 ||
		req.body.firstName.length === 0 ||
		req.body.surname.length === 0 ||
		req.body.email.length === 0 ||
		req.body.roomId.length === 0 ||
		req.body.checkInDate.length === 0 ||
		req.body.checkOutDate.length === 0
	) {
		res.status(400).send('Please fill out all the fields');
	} else {
		bookings.push({
			id: uuid.v4(),
			title: req.body.title,
			firstName: req.body.firstName,
			surname: req.body.surname,
			email: req.body.email,
			roomId: req.body.roomId,
			checkInDate: req.body.checkInDate,
			checkOutDate: req.body.checkOutDate,
		});
		res.status(201).send(bookings);
	}
});

app.get('/bookings/search', (req, res) => {
	const date = req.query.date;
	let dateMatch = bookings.filter((booking) => {
		return (
			dayjs(date).isSameOrAfter(booking.checkInDate) &&
			dayjs(date).isSameOrBefore(booking.checkOutDate)
		);
	});
	res.status(200).json(dateMatch);
});

app.get('/bookings/:id', (req, res) => {
	const id = req.params.id;
	let requestedPerson = bookings.find((booking) => booking.id == id);
	if (requestedPerson) {
		res.status(200).send(requestedPerson);
	} else {
		res.status(404).end();
	}
});

app.delete('/bookings/:id', (req, res) => {
	const id = +req.params.id;
	let newBookings = bookings.filter((booking) => booking.id !== id);
	if (newBookings.length === bookings.length) {
		res.status(404).send('There is no bookings with such ID');
	} else {
		bookings = newBookings;
		res.status(200).send(bookings);
	}
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});
