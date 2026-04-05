import express from "express";
import Opportunity from "../models/Opportunity";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Error creating opportunity", error });
  }
});

router.get("/", async (_req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunities" });
  }
});

export default router;