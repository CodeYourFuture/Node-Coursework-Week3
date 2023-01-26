const express = require('express')
const cors = require('cors')
const uuid = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

//Use this array as your (in-memory) data store.
const bookings = require('./bookings.json')

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.')
})

// TODO add your routes and helper functions here

app.get('/bookings', (req, res) => {
  res.json(bookings)
})

app.get('/bookings/:id', (req, res) => {
  const id = Number(req.params.id)
  let bookingsCopy = bookings

  res.json(bookingsCopy.filter((booking) => booking.id === id))
})

app.post(
  ('/bookings',
  (req, res) => {
    const newBooking = {
      id: uuid.v4(),
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    }

    // if(
    //   !req.body.title ||
    //     !req.body.firstName ||
    //     !req.body.surname ||
    //     !req.body.email ||
    //     !req.body.roomId ||
    //     !req.body.checkInDate ||
    //     !req.body.checkOutDate
    // ){res.status(404).json({ msg: 'Please fill all fields' })}

    bookings.push(newBooking)
    console.log(bookings)
    res.json(newBooking)
  })
)

app.delete('/bookings/:id', (req, res) => {
  const id = Number(req.params.id)
  let bookingId = bookings.find((booking) => booking.id === id)
  const bookingIndex = bookings.findIndex((i) => i === id)

  !bookingId && res.status(404).send('Not Found')

  bookings.splice(bookingIndex, 1)
  res.send('Booking deleted')
})

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
