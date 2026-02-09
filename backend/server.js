import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import shareRoutes from "./routes/share.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/share", shareRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on 5000")
    );
  })
  .catch(err => console.log(err));
