import { defineStore } from 'pinia'

export interface Booking {
  services?: string[]
  moving_date?: string
  cleaning_date?: string
  is_flexible_date?: boolean
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
    booking: {} as Booking
  }
),
  actions: {
    updateBooking(data: Partial<Booking>) {
      console.log("received data: ", data)
      this.booking = { ...this.booking, ...data }
    },
    clearBooking() {
      this.booking = {}
    },
  },
})
