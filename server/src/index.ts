import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import opportunityRoutes from "./routes/opportunityRoutes";
import studentProfileRoutes from "./routes/studentProfileRoutes";
import studentQuizRoutes from "./routes/studentQuizRoutes";
import voiceRoutes from "./routes/voiceRoutes"; // ← new

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

connectDB();

app.get("/", (_req, res) => {
  res.status(200).send("API is running...");
});

const PORT = process.env.PORT || 8000;

app.use("/api/opportunities", opportunityRoutes);
app.use("/api/opportunities", voiceRoutes);       // ← new: POST /api/opportunities/voice
app.use("/api/students/profile", studentProfileRoutes);
app.use("/api/students/quiz", studentQuizRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});