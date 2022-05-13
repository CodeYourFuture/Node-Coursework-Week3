const express = require('express')
const cors = require('cors')
const moment = require('moment')
const CheckValidator = require('check-validator')

moment().format('YYYY-MM-DD')

let validator = new CheckValidator()

const app = express()

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3001

//Use this array as your (in-memory) data store.
let bookings = require('./bookings.json')

const fields = [
  { title: 'Title' },
  { firstName: 'First Name' },
  { surname: 'Surname' },
  { email: 'Email' },
  { roomId: 'Room Id' },
  { checkInDate: 'Check In Date' },
  { checkOutDate: 'Check Out Date' },
]

app.get('/', function (request, response) {
  response.send('Hotel booking server.  Ask for /bookings, etc.')
})

app.get('/bookings', (req, res, next) => {
  res.send(bookings)
})

// search
app.get('/bookings/search', (req, res, next) => {
  // search by date
  if (req.query.date) {
    const searchDate = req.query.date
    const filteredData = bookings.filter((booking) =>
      moment(searchDate).isBetween(booking.checkInDate, booking.checkOutDate),
    )
    if (filteredData.length == 0) res.status(400).send('Booking not found!')
    else res.send(filteredData)
  }
  // free text search
  else if (req.query.term) {
    const searchTerm = req.query.term
    const filteredData = bookings.filter(
      (booking) =>
        booking.email.includes(searchTerm) ||
        booking.firstName.includes(searchTerm) ||
        booking.surname.includes(searchTerm),
    )
    if (filteredData.length == 0) res.status(400).send('Term not found!')
    else res.send(filteredData)
  }
})

//search by id
app.get('/bookings/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  const foundBooking = bookings.find((booking) => booking.id === id)
  if (foundBooking) res.status(200).send(foundBooking)
  else res.status(400).send('Booking not found!')
})

//add new booking
app.post('/bookings', (req, res, next) => {
  if (checkValidate(req, res)) {
    const newId = Math.max(...bookings.map((b) => b.id)) + 1
    let newBooking = { id: newId }
    fields.map(
      (field, index) =>
        (newBooking[Object.keys(fields[index])[0]] =
          req.body[Object.keys(fields[index])[0]]),
    )

    bookings.push(newBooking)
    res.sendStatus(200)
  }
})

//delete a booking by id
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

//check validation
const checkValidate = (req, res) => {
  let result = false
  let message = ''

  fields.forEach((field, index) => {
    !req.body[Object.keys(fields[index])[0]] &&
      (message = `Please fill ${Object.values(fields[index])[0]}!`)
  })

  //if(!isDateValid(req.body.checkInDate,req.body.checkOutDate))
  //  message = `checkOutDate is not after checkInDate`

  validator.clear()
  validator.isEmail(req.body.email, 'Enter valid email!')
  if (!validator.isValid()) message = validator.errors()

  message ? res.status(400).send(message) : (result = true)

  return result
}

// const isDateValid = (dateIn, dateOut) => {
//   const _dateIn = moment(dateIn)
//   const _dateOut = moment(dateOut)
//   return (
//     moment(_dateIn).isValid() &&
//     moment(_dateOut).isValid() &&
//     moment(_dateOut).isAfter(_dateIn)
//   )
// }
