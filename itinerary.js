import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  itineraryDetails: {
    required: true,
    type: String,
  },
  hasData: {
    required: true,
    type: Boolean,
  },
  prompt: {
    required: true,
    type: Object,
  },
});
const ItineraryModel = mongoose.model("itinerary", dataSchema);
export default ItineraryModel;
