const item = req.query.term ? req.query.term.toLowerCase() :"";
  const date=moment(req.query.date)
  console.log(`item is${item}`);
  console.log(date)
  console.log(moment(bookings[0].checkInDate));
  // if (!req.body.term && !req.body.date) {
  //   res.status(400).send("Please add search item");
  //   return;
  // }
  
  // Search for bookings that match the search term and span the given date
  let searchedBooking = bookings.filter((c) =>
    (c.firstName.toLowerCase().includes(item) ||c.surname.toLowerCase().includes(item) || c.email.includes(item) || moment(c.checkInDate).isSame(date))
  );

  if (searchedBooking.length === 0) {
    res.status(404).json({ msg: `Booking not found` });
    return;
  }
  res.json(searchedBooking);