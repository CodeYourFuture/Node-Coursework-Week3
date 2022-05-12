const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3001

//Use this array as your (in-memory) data store.
let bookings = require('./bookings.json')

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.')
})

// TODO add your routes and helper functions here

app.get('/bookings', (req, res, next) => {
  res.send(bookings)
})

app.get('/bookings/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  const foundBooking = bookings.find((booking) => booking.id === id)
  if (foundBooking) res.status(200).send(foundBooking)
  else res.status(404).send('Booking not found!')
})

app.post('/bookings', (req, res, next) => {
  if (checkValidate(req, res)) {
    const newId = Math.max(...bookings.map((b) => b.id)) + 1
    const newBooking = {
      id: newId,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    }
    bookings.push(newBooking)
    res.sendStatus(200)
  }
})

app.delete('/bookings/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  const foundBooking = bookings.find((booking) => booking.id === id)
  if (foundBooking) {
    bookings = bookings.filter((message) => message.id != id)
    res.sendStatus(200)
  } else res.status(404).send('Booking not found!')
})
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})

const checkValidate = (req, res) => {
  let result = false
  if (!req.body.title) res.status(400).send('Please fill Title!')
  else if (!req.body.firstName) res.status(400).send('Please fill First Name!')
  else if (!req.body.surname) res.status(400).send('Please fill Surname!')
  else if (!req.body.email) res.status(400).send('Please fill Email!')
  else if (!req.body.roomId) res.status(400).send('Please fill Room Id!')
  else if (!req.body.checkInDate) res.status(400).send('Please fill Check In Date!')
  else if (!req.body.checkOutDate) res.status(400).send('Please fill Check Out Date!')
  else { result = true
  }
  return result  
}
