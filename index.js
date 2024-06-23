import dotenv from "dotenv/config";
import express from "express";
const app = express();

import bodyParser from "body-parser";
const port = process.env.PORT;

import cors from "cors";
import { queryGPT } from "./model.js";
import { fetchImagesForItinerary } from "./places.js";

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Running express server on vercel");
});

app.post("/prompt", async (request, response) => {
  const promptRequest = request.body;
  const itineraryJSON = await queryGPT(promptRequest);
  const finalResponse = await fetchImagesForItinerary(itineraryJSON);
  response.send({ response: JSON.stringify(finalResponse) });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

export default app;
