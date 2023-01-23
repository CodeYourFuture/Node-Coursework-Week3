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

app.get('/bookings', (req, res) => {
  res.json(bookings)
})

app.get('/bookings/:id', (req, res) => {
  const id = Number(req.params.id)
  let bookingsCopy = bookings

  res.json(bookingsCopy.filter((booking) => booking.id === id))
})

app.post(('/bookings', (req, res) => {
  let body = req.body
  console.log(body)
}))

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
