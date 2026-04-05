import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import opportunityRoutes from "./routes/opportunityRoutes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


connectDB();

app.get("/", (_req, res) => {
  res.status(200).send("API is running...");
});

const PORT = process.env.PORT || 8000;
app.use("/api/opportunities", opportunityRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
