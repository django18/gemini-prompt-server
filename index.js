import dotenv from "dotenv/config";
import express from "express";
const app = express();

import bodyParser from "body-parser";
const port = process.env.DEV_PORT;

import cors from "cors";
import model from "./model.js";
import { fetchImagesForItinerary } from "./places.js";

app.use(cors());
app.use(bodyParser.json());

app.post("/prompt", async (request, response) => {
  const promptRequest = request.body;
  const text = await model.run(promptRequest);
  const finalResponse = await fetchImagesForItinerary(JSON.parse(text));
  response.send({ response: JSON.stringify(finalResponse) });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
