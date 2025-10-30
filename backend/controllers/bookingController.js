
export const createBooking = async (req, res) => {
  try {
    const { experienceId, slotId, date, time, guests, name, email, phone, promoCode } = req.body;

    if (!experienceId || !slotId || !date || !time || !guests || !name || !email || !phone) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    console.log("✅ Booking received:", {
      experienceId,
      slotId,
      date,
      time,
      guests,
      name,
      email,
      phone,
      promoCode,
    });

    
    const newBooking = {
      id: Date.now(),
      experienceId,
      slotId,
      date,
      time,
      guests,
      name,
      email,
      phone,
      promoCode,
      createdAt: new Date(),
    };

    res.status(201).json({
      message: "Booking successful!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
