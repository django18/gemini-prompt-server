import dotenv from "dotenv/config";
import express from "express";
import db from "./db.js";
import ItineraryModel from "./itinerary.js";

const app = express();

import bodyParser from "body-parser";
const port = process.env.PORT;
import cors from "cors";
import { queryGPT } from "./model.js";
import { fetchImagesForItinerary } from "./places.js";

app.use(bodyParser.json());

// Middleware to enable CORS
app.use(cors());
app.options("*", cors()); // Enable preflight requests for all routes

app.use(
  cors({
    origin: "*", // Allow only your specific origin
    methods: "GET,POST,OPTIONS,PUT,PATCH,DELETE",
    allowedHeaders: "X-Requested-With,Content-Type",
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.send("Running vercel");
});

const processAndStoreItinerary = async (id, rquestParams) => {
  // get response from gemini and update db with results
  const promptRequest = rquestParams;
  const itineraryJSON = await queryGPT(promptRequest);
  const itineraryWithImages = await fetchImagesForItinerary(itineraryJSON);
  const updateData = {
    itineraryDetails: JSON.stringify(itineraryWithImages),
    hasData: true,
  };
  const options = { new: true };
  await ItineraryModel.findByIdAndUpdate(id, updateData, options);
};

app.post("/prompt", async (req, res) => {
  try {
    const data = new ItineraryModel({
      itineraryDetails: "Building Itinerary",
      prompt: req.body,
      hasData: false,
    });
    const initialSaveResponse = await data.save();
    res.status(200).json(initialSaveResponse).end();
    processAndStoreItinerary(initialSaveResponse._id, req.body);
  } catch (error) {
    console.log({ error });
    res.status(404).send();
  }
});

app.get("/itinerary", async (req, res) => {
  try {
    const id = req.query.id;
    const itinerary = await ItineraryModel.findById(id);
    res
      .send({ hasData: itinerary.hasData, data: itinerary.itineraryDetails })
      .end();
  } catch (error) {
    res.send({ isError: error });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

export default app;
