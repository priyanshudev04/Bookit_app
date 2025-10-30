import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Clock, Star, Users, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [guests, setGuests] = useState(1);


  const { data: experience, isLoading: experienceLoading } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/experiences/${id}`);
      if (!res.ok) throw new Error("Failed to fetch experience");
      return res.json();
    },
    enabled: !!id,
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ["slots", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/experiences/${id}/slots`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
    enabled: !!id,
  });

  const filteredSlots = selectedDate
    ? slots.filter((slot: any) => {
        const slotDate = new Date(slot.date).toLocaleDateString("en-CA");
        const selected = selectedDate.toLocaleDateString("en-CA");
        return slotDate === selected;
      })
    : [];

  
  const handleBookNow = () => {
    if (!selectedDate || !selectedSlot) {
      toast({
        title: "Selection Required",
        description: "Please select a date and time slot before booking.",
        variant: "destructive",
      });
      return;
    }

    const slot = slots.find((s: any) => s.id === selectedSlot);

    if (!slot) {
      toast({
        title: "Slot not found",
        description: "Please reselect your time slot.",
        variant: "destructive",
      });
      return;
    }


    const sanitizedExperience = {
      id: experience.id,
      title: experience.title,
      image: experience.image,
      price: experience.price,
      category: experience.category,
    };

    const sanitizedSlot = {
      id: slot.id,
      date: slot.date,
      time: slot.time,
    };

    navigate("/checkout", {
      state: {
        experience: sanitizedExperience,
        slot: sanitizedSlot,
        guests,
      },
    });
  };

  // ✅ Loading state
  if (experienceLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Handle missing experience
  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back 
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {experience.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold">{experience.rating || 4.8}</span>
                  <span className="text-muted-foreground">
                    ({experience.reviewCount || 128} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{experience.location || "Jaipur, Rajasthan"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{experience.duration || "2 hours"}</span>
                </div>
              </div>

              <p className="text-lg text-foreground leading-relaxed">
                {experience.description ||
                  "Enjoy your relaxing and rejuvenating experience. Unwind, refresh, and feel the stress melt away as you immerse yourself in a truly serene environment."}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3">
                  {(experience.highlights && experience.highlights.length > 0
                    ? experience.highlights
                    : [
                        "Welcome drink on arrival",
                        "Access to spa & wellness area",
                        "Complimentary massage oil",
                        "Professional therapist guidance",
                      ]
                  ).map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - BOOKING */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-3xl font-bold">₹{experience.price}</span>
                    <span className="text-muted-foreground"> / person</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Guests */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      -
                    </Button>
                    <div className="flex items-center gap-2 min-w-20 justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-semibold">{guests}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setGuests(Math.min(10, guests + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Select Time Slot
                    </label>
                    {slotsLoading ? (
                      <p className="text-muted-foreground text-sm">Loading slots...</p>
                    ) : filteredSlots.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredSlots.map((slot: any) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot === slot.id ? "default" : "outline"}
                            onClick={() => setSelectedSlot(slot.id)}
                            className="w-full"
                          >
                            {slot.time} ({slot.available} left)
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        No slots available for this date.
                      </p>
                    )}
                  </div>
                )}

                {/* Price Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">
                      ₹{experience.price} × {guests} guest{guests > 1 ? "s" : ""}
                    </span>
                    <span className="text-xl font-bold">
                      ₹{experience.price * guests}
                    </span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
