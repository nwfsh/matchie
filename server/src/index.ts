import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import opportunityRoutes from "./routes/opportunityRoutes";
import studentProfileRoutes from "./routes/studentProfileRoutes";
import studentQuizRoutes from "./routes/studentQuizRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

connectDB();

app.get("/", (_req, res) => {
  res.status(200).send("API is running...");
});

const PORT = process.env.PORT || 8000;
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/students/profile", studentProfileRoutes);
app.use("/api/students/quiz", studentQuizRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
