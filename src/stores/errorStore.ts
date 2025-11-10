import { defineStore } from 'pinia'

export const useErrorStore = defineStore('Errors', {

    state: () => ({
        message: null as string | null,
        details: null as unknown | null,
    }),
    actions: {
        setError(message: string | null, details: unknown = null) {
            this.message = message
            this.details = details
            console.error("App Error:", message, details)
        },
        clearError() {
            this.message = null
            this.details = null
        }
    }
})
