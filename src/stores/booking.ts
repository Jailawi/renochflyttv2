import { defineStore } from 'pinia'

export interface Booking {
  services?: string[]
  moving_date?: string
  cleaning_date?: string
  is_flexible_date?: boolean
  estimated_price?: number | null
  current_address?: {
    address?: string
    residence_type?: string
    living_area?: number
    floor?: number
    accessibility?: string
  }
  new_address?: {
    address?: string
    residence_type?: string
    living_area?: number
    floor?: number
    accessibility?: string
  }
  contact?: {
    name?: string
    ssn?: string
    rutavdrag?: boolean
    email?: string
    phone?: string
    message?: string
    consent?: boolean
  }
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    booking: {} as Booking,
    calculating: false
  }),
  actions: {
    updateBooking(data: Partial<Booking>) {
      this.booking = { ...this.booking, ...data }
    },
    clearBooking() {
      this.booking = {}
    },
    setEstimatedPrice(price: number | null) {
      this.booking.estimated_price = price
    },
    setCalculating(calculating: boolean) {
      this.calculating = calculating
    }
  },
})
