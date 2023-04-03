const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const port = 3000

//Use this array as your (in-memory) data store.
const bookings = require('./bookings.json')

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.')
})

// TODO add your routes and helper functions here

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
  res.send(booking)
})

// const listener = app.listen(process.env.PORT, function () {
//   console.log('Your app is listening on port ' + listener.address().port)
// })

const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
})
