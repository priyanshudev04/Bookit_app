import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import Experience from "./models/experience.js";

await connectDB();

const sample = [
  {
    title: "Mountain Sunrise Trek",
    category: "Adventure",
    location: "Rocky Mountains",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    shortDescription: "Watch the sunrise from stunning mountain peaks",
    description: "Experience the breathtaking beauty of dawn from mountain peaks.",
    duration: "4 hours",
    rating: 4.8,
    reviewCount: 156,
    price: 89
  },
  {
    title: "Coastal Kayaking Adventure",
    category: "Water Sports",
    location: "Pacific Coast",
    image: "https://images.unsplash.com/photo-1545515762-46a013bb70d5?w=800&q=80",
    shortDescription: "Paddle through crystal clear waters and explore hidden coves",
    duration: "3 hours",
    rating: 4.9,
    reviewCount: 203,
    price: 120
  },
  {
    title: "Forest Meditation Retreat",
    category: "Wellness",
    location: "Greenwood Forest",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    shortDescription: "Rejuvenate with guided meditation in serene forest settings",
    duration: "2 days",
    rating: 4.7,
    reviewCount: 98,
    price: 199
  }
];

try {
  await Experience.deleteMany({});
  const created = await Experience.insertMany(sample);
  console.log(`Inserted ${created.length} sample experiences`);
  process.exit(0);
} catch (err) {
  console.error("Seed error", err);
  process.exit(1);
}
