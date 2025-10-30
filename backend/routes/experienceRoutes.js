import express from "express";
import {
  getExperiences,
  getExperienceById,
  createExperience,
  deleteExperience,
} from "../controllers/experienceControllers.js";

const router = express.Router();


router.get("/:id/slots", (req, res) => {
  const { id } = req.params;

  const slots = [
    {
      id: "slot-1",
      date: "2025-10-31",
      time: "10:00 AM - 12:00 PM",
      available: 5,
    },
    {
      id: "slot-2",
      date: "2025-10-31",
      time: "02:00 PM - 04:00 PM",
      available: 3,
    },
    {
      id: "slot-3",
      date: "2025-11-01",
      time: "09:00 AM - 11:00 AM",
      available: 8,
    },
  ];

  res.json(slots);
});

// ✅ Main experience routes
router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.post("/", createExperience);
router.delete("/:id", deleteExperience);

export default router;
