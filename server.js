const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

//Use this array as your (in-memory) data store.
const bookings = require('./bookings.json')

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.')
})

// TODO add your routes and helper functions here

let id = bookings.length

// 1. Creat a new booking
app.post('/bookings', (req, res) => {
  const booking = {
    title: 'Miss',
    firstName: 'Matilda',
    surname: 'Spence',
    email: 'matilda@example.com',
    roomId: 6,
    checkInDate: '2018-04-12',
    checkOutDate: '2018-04-19',
  }
  if (!booking || Object.keys(booking).length !== 7) {
    res.status(404).send('Error')
  } else {
    booking.id = id
    bookings.push(booking)
    res.send(
      `Booking added for ${booking.title} ${booking.firstName} ${booking.surname}`
    )
  }
  id++
  console.log(bookings)
})

// 1. Read all bookings
app.get('/bookings', (req, res) => {
  res.send(bookings)
})

// 1. Read one booking, specified by an ID
app.get('/bookings/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  const booking = bookings.find((mes) => {
    return mes.id.toString() === id
  })
  if (!booking) {
    req.send('error 404')
  } else {
    res.send(booking)
  }
})

// 1. Delete a booking, specified by an ID
app.delete('/bookings/delete/:id', (req, res) => {
  const id = req.params.id
  const booking = bookings.find((mes) => {
    return mes.id.toString() === id
  })
  if (!booking) {
    res.send('error 404')
  } else {
    bookings.splice(booking, 1)
    res.send(`Message with id: ${id} has been deleted`)
  }
})

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
