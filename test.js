const data = [
  {
    id: 1,
    title: "Mr",
    firstName: "Jimi",
    surname: "Hendrix",
    email: "jimi@example.com",
    roomId: 2,
    checkInDate: "2017-11-21",
    checkOutDate: "2017-11-23",
  },
  {
    id: 2,
    title: "King",
    firstName: "James",
    surname: "Brown",
    email: "jamesbrown@example.com",
    roomId: 1,
    checkInDate: "2018-02-15",
    checkOutDate: "2018-02-28",
  },
];

let test = data.filter(x => {
    let values = Object.values(x);
    return values.includes("King")
})

console.log(test);