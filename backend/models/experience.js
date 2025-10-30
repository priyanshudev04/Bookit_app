import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    location: { type: String, default: "Unknown" },
    image: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;

