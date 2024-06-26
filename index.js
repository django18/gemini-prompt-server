import dotenv from "dotenv/config";
import express from "express";
const app = express();

import bodyParser from "body-parser";
const port = process.env.PORT;

import { queryGPT } from "./model.js";
import { fetchImagesForItinerary } from "./places.js";

app.use(bodyParser.json());

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.status(200).send();
});

app.get("/", (_, res) => {
  res.send("Running vercel");
});

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

app.post(
  "/prompt",
  allowCors(async (request, response) => {
    const promptRequest = request.body;
    const itineraryJSON = await queryGPT(promptRequest);
    const finalResponse = await fetchImagesForItinerary(itineraryJSON);
    response.send({ response: JSON.stringify(finalResponse) });
  })
);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

export default app;
