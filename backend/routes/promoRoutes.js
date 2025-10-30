
import express from "express";
const router = express.Router();

// Mock promo codes
const promos = [
  { code: "SAVE10", type: "percentage", value: 10, description: "Save 10% on your booking!" },
  { code: "FLAT100", type: "flat", value: 100, description: "Get ₹100 off instantly!" },
  { code: "WELCOME20", type: "percentage", value: 20, description: "Welcome offer: 20% discount!" },
];

router.get("/:code", (req, res) => {
  const promo = promos.find(
    (p) => p.code.toLowerCase() === req.params.code.toLowerCase()
  );
  if (!promo) {
    return res.status(404).json({ message: "Promo code not found" });
  }
  res.json(promo);
});

export default router;
