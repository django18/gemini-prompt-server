import dotenv from "dotenv/config";
import express from "express";
import { v4 as uuidv4 } from "uuid";
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

// Alternatively, configure CORS with specific options
app.use(
  cors({
    origin: "*", // Allow only your specific origin
    methods: "GET,POST,OPTIONS,PUT,PATCH,DELETE",
    allowedHeaders: "X-Requested-With,Content-Type",
    credentials: true,
  })
);

// const setResponseHeaders = (res, req) => {
//   res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
// };

// app.options("/prompt", (req, res) => {
//   setResponseHeaders(res, req);
//   res.status(200).send();
// });

app.get("/", (_, res) => {
  res.send("Running vercel");
});

const allowCors = (fn) => async (req, res) => {
  setResponseHeaders(res, req);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

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
    // const data = new ItineraryModel({
    //   itineraryDetails: "Building Itinerary",
    //   prompt: req.body,
    //   hasData: false,
    // });
    // const initialSaveResponse = await data.save();
    res.status(200).send({
      itineraryDetails: "Building Itinerary",
      prompt: req.body,
      hasData: false,
    });
    // processAndStoreItinerary(initialSaveResponse._id, req.body);
    console.log("Finish Processing");
  } catch (error) {
    res.status(404).send();
  }
});

app.get(
  "/itinerary",
  allowCors(async (req, res) => {
    const id = req.query.id;
    const itinerary = await ItineraryModel.findById(id);
    res.json({ hasData: itinerary.hasData, data: itinerary.itineraryDetails });
  })
);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

export default app;
