import mongoose, { Schema, Document } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  causeArea: string;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  commitmentType: string;
  location: string;
  isRemote: boolean;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    title: { type: String, required: true },
    causeArea: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    commitmentType: { type: String, required: true },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);