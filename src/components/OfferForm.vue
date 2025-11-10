<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Stepper, Step, StepList } from 'primevue'
import { Form, useField, useForm } from 'vee-validate'
import ServiceSelection from './ServiceSelection.vue'
import MovingDate from './MovingDate.vue'
import Residence from './Residence.vue'
import Contact from './Contact.vue'
import { useRouter } from 'vue-router/auto'
import { useBookingStore } from '@/stores/booking'
import { apiClient } from '@/main'
import { useErrorStore } from '@/stores/errorStore'

const step = ref(1)

const emit = defineEmits(['toggleMenu'])

const router = useRouter()

const errorStore = useErrorStore()

const prev = () => {
  if (step.value > 1) {
    step.value--
  }
  if (step.value === 4) {
    console.log("Estimate booking:", useBookingStore().booking)
    useBookingStore().setEstimatedPrice(null);
  }

}

const next = async () => {
  if (step.value < 5) {
    step.value++
  }
  if (step.value === 5) {
    console.log("Estimate booking:", useBookingStore().booking)
    useBookingStore().setCalculating(true);
    try {
      emit('toggleMenu')
      const response = await apiClient.post('/offer-estimate', useBookingStore().booking, { headers: { 'Content-Type': 'application/json', "X-API-KEY": "RvCiOYMDImW02G4IUEH6fU4qxnbEkv9s" } });
      const data = response.data;
      const estimatedPrice = data['estimated_price'];
      useBookingStore().setEstimatedPrice(estimatedPrice);
      errorStore.clearError()
    } catch (error) {
      // console.error("Could not estimate booking: ", error)
      errorStore.setError("Could not estimate booking", error)
    } finally {
      useBookingStore().setCalculating(false);
    }
  }
}

const submit =  async () => {
  const plainBooking = (useBookingStore().booking);
  const headers = { 'Content-Type': 'application/json', "X-API-KEY": "RvCiOYMDImW02G4IUEH6fU4qxnbEkv9s" };
  try {
    const response = await apiClient.post('/booking', plainBooking, { headers });
    // console.log('Booking submitted successfully:', response.data)
    window.location.href = 'https://renochflytt.se/offert-bekraftelse'
  } catch (error) {
    console.error('Error submitting booking:', error)
  }
}


</script>

<template lang="">
  <div className="flex flex-col gap-4 mt-4">
    <Stepper :value="step" linear>
      <StepList class="!overflow-hidden">
        <Step :value="1"></Step>
        <Step :value="2"></Step>
        <Step :value="3"></Step>
        <Step :value="4"></Step>
        <Step :value="5"></Step>
      </StepList>
    </Stepper>
    <ServiceSelection v-show="step === 1" @next="next" />
    <MovingDate v-show="step === 2" @prev="prev" @next="next" />
    <Residence v-show="step === 3" @prev="prev" @next="next" residence="current" />
    <Residence v-show="step === 4" @prev="prev" @next="next" residence="new" />
    <Contact v-show="step === 5" @prev="prev" @submit="submit" />
    <!-- <OfferCalculation v-show="step === 6" @toggle="toggleOfferCalc" /> -->
    <!-- <p className="text-wrap">{{ values }}</p> -->
  </div>
</template>
