import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_DB_URL);
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("connected", () => {
  console.log("Database Connected");
});

export default db;
