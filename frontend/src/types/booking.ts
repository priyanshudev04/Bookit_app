export interface Experience {
  type?: 'destination' | 'experience'; 
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: number;
  total: number;
}

export interface BookingDetails {
  type?: 'destination' | 'experience'; 
  experienceId?: string;               
  destinationId?: string;              
  slotId?: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  promoCode?: string;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  message: string;
  details?: BookingDetails;
  finalPrice?: number;
}
