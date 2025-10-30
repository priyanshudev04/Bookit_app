import axios from "axios";
import { Experience, BookingDetails, BookingResult, PromoCode, TimeSlot } from "@/types/booking";


const API_BASE_URL = "http://localhost:5000/api";

export const mockApi = {
  async getExperiences(): Promise<Experience[]> {
    const res = await axios.get(`${API_BASE_URL}/experiences`);
    return res.data;
  },

  async getExperience(id: string): Promise<Experience | null> {
    const res = await axios.get(`${API_BASE_URL}/experiences/${id}`);
    return res.data || null;
  },

    async createBooking(details: BookingDetails): Promise<BookingResult> {
    try {
      console.log("📦 Sending booking payload to backend:", details);

      const res = await axios.post(`${API_BASE_URL}/bookings`, details, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Booking API success:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("❌ Booking API error:", error.response?.data || error.message);
      throw error;
    }
  },


  async validatePromoCode(code: string): Promise<PromoCode | null> {
    const res = await axios.get(`${API_BASE_URL}/promos/${code}`);
    return res.data || null;
  },

  async getAvailableSlots(experienceId: string): Promise<TimeSlot[]> {
    const res = await axios.get(`${API_BASE_URL}/experiences/${experienceId}/slots`);
    return res.data;
  },
};
