# Challenge: A Hotel Booking Server

### Overview: what is this challenge?

In this challenge you must make an Express app which provides an API to manage a list of hotel bookings, in JSON format.

In the advanced part of this exercise you will modify your React hotel app which you built during the React module, to read, create, and delete room bookings.

We also provide a basic React front-end to allow you to test some of the functionality.

### Requirements

You should have completed at least Level 1-3 of the Chat Server challenge before attempting this challenge.

## Level 1 Challenge - make the booking server

At this first level, your API must allow a client to:

1. Create a new booking
1. Read all bookings
1. Read one booking, specified by an ID
1. Delete a booking, specified by an ID

If the booking to be read cannot be found by id, return a 404.

If the booking for deletion cannot be found by id, return a 404.

All booking content should be passed as JSON.

See the later spoiler section "Correct Routes" if you are not sure of the correct routes.

### Testing

You should use the app "postman" to test creating and deleting bookings.

You can also try with this ALPHA-version [hotel tester app: https://cyf-hotel-tester.netlify.com/](https://cyf-hotel-tester.netlify.com/).

- Note that you'll have to click `set API` and enter your own base URL (e.g. https://alisina-hotel-server.glitch.me)
- Do not rely on this app for your testing. Be sure to check the javascript console if it misbehaves.

## Data model

Each booking is an object with the following properties:

| Name         | Type   | Example           |
| ------------ | ------ | ----------------- |
| id           | number | 1                 |
| roomId       | number | 123               |
| title        | string | "Mr"              |
| firstName    | string | "John"            |
| surname      | string | "Doe"             |
| email        | string | "johndoe@doe.com" |
| checkInDate  | string | "2017-11-21"      |
| checkOutDate | string | "2017-11-23"      |

- Dates are in the format YYYY-MM-DD

- The `id` field must be assigned on the server, not by the client.

## Want to run your code on the internet?

If you want to share your server with other people the easiest way to do this is to use Glitch

- [ ] Make sure you're logged in to https://glitch.com/
- [ ] Remix this server on glitch - https://glitch.com/~cyf-hotel-start
- [ ] Name your new server `yourname-hotel-server`
- [ ] Make sure you're logged in so that it saves
- [ ] Check that it is working by making a request to `/`
- [ ] Take time to read the comments
- [ ] Copy the code you've written to Glitch

# Go ahead!

If you think you know how to do that, go ahead!

Try to use what you know to do this challenge on your own. It does not require any new knowledge.

You may find useful the [express cheatsheet](https://github.com/nbogie/express-notes/blob/master/express-cheatsheet.md)

# End of Level 1 challenge!

Well done!

What to do now:

Don't post on slack, unless there's a thread announced specifically for it.
Instead, attach the URLs as links when you "mark done" your assignment in Google Classroom.
You might want to download your project for safekeeping. (Tools: Git, Import, and Export: Download Project)

# Level 2 - simple validation

For this level, your server must reject requests to create bookings if:

- any property of the booking object is missing or empty.

In this case your server should return a status code of 400, and should NOT store the booking in the bookings array.

# Level 3 (Optional, advanced) - search by date

For this level your API must also allow a client to:

Search for bookings which span a date (given by the client).

It should accept requests of the following format:

`/bookings/search?date=2019-05-20`

Hint: use the `moment` library to make this easier.

# Level 4 (Optional, advanced) - advanced validation

In this level, bookings should also be rejected if:

- email address is not valid (hint: use a library to do this - [search here](https://www.npmjs.com/))
- checkoutDate is not after checkinDate (hint: use the `moment` library to check this)

# Level 5 (Optional, easy) - free-text search

For this level your API must also allow a client to:

Search for bookings which match a given search term.

It should accept requests of the following format:

`/bookings/search?term=jones`

It should match if the term occurs in _any_ of `email`, `firstName`, or `surname` fields.

# Level 6 (Optional) - make your React app use your new server

For this level, change your react hotel front-end to use your own back-end API that you have designed here in this challenge. Adjust it so that all the functionality works.

# Spoiler: Correct Routes

| method | example path                     | behaviour                                   |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | /bookings                        | return all bookings                         |
| GET    | /bookings/17                     | get one booking by id                       |
| GET    | /bookings/search?term=jones      | get all bookings matching a search term     |
| POST   | /bookings                        | create a new booking                        |
| DELETE | /bookings/17                     | delete a booking by id                      |
| GET    | /bookings/search?date=2019-05-20 | return all bookings spanning the given date |
