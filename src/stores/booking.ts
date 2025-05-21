import { defineStore } from 'pinia'

export interface Booking {
  movingDate?: string;
  flexibleDate?: string; 
  area?: number;
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    booking: {
      movingDate: undefined,
      flexibleDate: undefined,
      area: undefined,
    } as Booking
  }),
  actions: {
    updateBooking(data: Partial<Booking>) {
      this.booking = { ...this.booking, ...data }
    },
    clearBooking() {
      this.booking = {}
    },
  },
})
