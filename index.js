require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.DEV_PORT;
var cors = require("cors");
const model = require("./model");

app.use(cors());
app.use(bodyParser.json());

app.post("/prompt", async (request, response) => {
  const { prompt } = request.body;
  const text = await model.run(prompt);
  response.send({ result: text });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
