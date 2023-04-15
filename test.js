app.get("/bookings/search", (req, res) => {
  const searchQuery = req.query.term;
  const dateQuery = req.query.date;
  console.log(searchQuery);

  if (!dateQuery) {
    const matchedBookings = bookings.filter(matchedSearchQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else if (!searchQuery) {
    const matchedBookings = bookings.filter(matchedDateQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else {
    const matchedBookings = bookings.filter(allMatchedQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  }

});
