const bookings = require("./bookings.json");

exports.getAllBookings = (req, res, next) => {
  console.log(bookings.length);
  res.status(200).json({
    length: bookings.length,
    data: {
      data: bookings,
    },
  });
  next();
};

exports.createBooking = (req, res, next) => {
  const { title, firstName, surname, email, roomId, checkInDate } = req.body;

  if (!title || !firstName || !surname || !email || !roomId || !checkInDate) {
    return res.status(404).json({
      data: {
        msg: "Provide all necessary fields",
      },
    });
  }
  const id = bookings[bookings.length - 1].id + 1;
  const newBooking = {
    id,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
  };
  bookings.push(newBooking);
  res.status(200).json({
    data: {
      data: newBooking,
    },
  });
};

exports.getBooking = (req, res, next) => {
  const query = +req.params.id;

  const booking = bookings.filter((item) => item.id === +query);

  if (booking.length === 0) {
    return res.status(404).json({
      data: {
        msg: "Booking with that ID not exist",
      },
    });
  }

  res.status(200).json({
    data: {
      data: booking,
    },
  });
};

exports.deleteBooking = (req, res, next) => {
  const query = +req.params.id;

  const index = bookings.findIndex((item) => item.id === +query);
  bookings.splice(index, 1);

  if (index === -1) {
    return res.status(404).json({
      data: {
        msg: "Booking with that ID not exist",
      },
    });
  }

  res.status(200).json({
    data: {
      data: [],
    },
  });
};
