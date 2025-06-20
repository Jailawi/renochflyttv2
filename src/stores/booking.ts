import { defineStore } from 'pinia'

export interface BookingOverview {
  movingDate?: string;
  flexibleDate?: string; 
  area?: number;
}

export interface Booking {
  movingDate: string;
  flexibleDate: string;
  area: number;
  services: string[];
  customerInfo: {
        name: string;
        ssn: string;
        rutavdrag: string;
        email: string;
        phone: string;
        message: string;
  }

}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    booking: {
      movingDate: undefined,
      flexibleDate: undefined,
      area: undefined,
    } as BookingOverview
  }),
  actions: {
    updateBooking(data: Partial<BookingOverview>) {
      this.booking = { ...this.booking, ...data }
    },
    clearBooking() {
      this.booking = {}
    },
  },
})
