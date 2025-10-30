import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 py-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">About BookIt</h1>
      <p className="max-w-2xl mx-auto text-gray-600 text-lg">
        Created by Priyanshu Pandey as a part of the Highway Delite project.{" "}
        <span className="font-semibold text-primary">BookIt</span> is your go-to platform
        for discovering and booking unforgettable experiences around the world.
        Whether you're seeking thrilling adventures, cultural tours, or relaxing
        getaways, BookIt connects you with trusted local guides to create
        memories that last a lifetime.
      </p>

      <div className="mt-10">
        <img src="/image.png" alt="BookIt Logo" className="mx-auto h-24 w-auto" />

        <Button onClick={() => navigate("/")} variant="outline" className="mt-6">
          ← Home
        </Button>
      </div>
    </div>
  );
}
