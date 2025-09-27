import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();
const app = express();

app.use(cors()); // dev: allow all origins
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/todos", todoRoutes);

// Health
app.get("/", (req, res) => res.send("Todo API running"));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
