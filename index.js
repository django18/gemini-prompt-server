require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
import { run } from "./model";

app.get("/", (req, res) => {
  console.log({ req });
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
