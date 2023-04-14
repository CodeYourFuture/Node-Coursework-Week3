require("dotenv").config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import bookings from "./routes/bookings";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req: Request, res: Response) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.use("/bookings", bookings);
``;

const listener = app.listen(process.env.PORT, function () {
  const { port } = listener.address() as AddressInfo;
  console.log("Your app is listening on port " + port);
});
