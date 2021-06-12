const express = require("express");
const cors = require("cors");
let isWithinInterval = require('date-fns/isWithinInterval');
let parseISO = require('date-fns/parseISO')

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let idNum = 6
app.get("/", function (request, response) {
    response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Create a booking
app.post("/bookings", function (request, response) {
    const newBooking = {
        title: request.body.title,
        firstName: request.body.firstName,
        surname: request.body.surname,
        email: request.body.email,
        roomId: request.body.roomId,
        checkInDate: request.body.checkInDate,
        checkOutDate: request.body.checkOutDate
    };

    for (key in newBooking) {
        if (newBooking[key] === "" || newBooking[key] === undefined) {
            return response.status(400).send("please fill all fields")
        }
    }

    newBooking.id = idNum++;                                                            //An Id number is added at this stage, so idNum does not increment when an empty field is posted
    bookings.push(newBooking);
    response.json(bookings);
});

//Read all bookings
app.get("/bookings", function (request, response) {
    response.json(bookings)
})

//Read a booking searched by date or by term
app.get("/bookings/search", function (request, response) {
    if (request.query.date) {
        const searchedDate = request.query.date;
        const searchedBooking = bookings.filter(booking => {                                            //isWithinInterval will return a boolean, it is imported from a library, along with parseISO 
            return isWithinInterval(parseISO(searchedDate), {
                start: new Date(parseISO(booking.checkInDate)),
                end: new Date(parseISO(booking.checkOutDate))
            });
        });

        if (searchedBooking.length === 0) {
            response.status(404).send(`No booking with date ${searchedDate}`);
        } else {
            response.json(searchedBooking);
        }

    } else if (request.query.term) {
        const searchedTerm = request.query.term;
        const searchedBooking = bookings.filter(booking =>
            booking.firstName.toLowerCase().includes(searchedTerm) ||
            booking.surname.toLowerCase().includes(searchedTerm) ||
            booking.email.toLowerCase().includes(searchedTerm)
        );

        if (searchedBooking.length === 0) {
            response.status(404).send(`No booking with term ${searchedTerm}`);
        } else {
            response.json(searchedBooking);
        }
    }
})

//Read a booking specified by an ID
app.get("/bookings/:id", function (request, response) {
    const bookingId = +request.params.id;
    const found = bookings.some(booking => booking.id === bookingId);

    if (found) {
        let searchedBooking = bookings.find(booking => booking.id === bookingId);
        response.json(searchedBooking);
    } else {
        response.status(404).send(`No booking with id ${bookingId}`);
    }
})

//Delete a booking specified by an ID
app.delete("/bookings/:id", function (request, response) {
    const bookingId = +request.params.id;
    const found = bookings.some(booking => booking.id === bookingId);

    if (found) {
        bookings = bookings.filter(booking => booking.id !== bookingId);
        response.json(bookings);
    } else {
        response.status(404).send(`No booking with id ${bookingId}`);
    }
})

const listener = app.listen(process.env.PORT || 5000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
