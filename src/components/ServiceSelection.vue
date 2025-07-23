<script setup lang="ts">
import { Button } from 'primevue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup' // Optional but recommended for schema validation
import Service from './Service.vue'
import truckIcon from './icons/truck.svg'
import installIcon from './icons/install.svg'
import cleaningIcon from './icons/cleaning.png'
import packageIcon from './icons/package.png'
import { useBookingStore } from '@/stores/booking'

const services = [
  { id: 'moving', name: 'Flytthjälp', icon: truckIcon },
  { id: 'cleaning', name: 'Flyttstädning', icon: cleaningIcon },
  { id: 'package', name: 'Packning', icon: packageIcon },
  { id: 'install', name: 'Montering', icon: installIcon },
]

const emit = defineEmits(['next'])

const validationSchema = yup.object({
  services: yup.array().min(1, 'Välj minst en tjänst').required('Välj minst en tjänst'),
})

const { validate, values, meta } = useForm({ validationSchema })
const { value: selectedServices, errorMessage } = useField<string[]>('services')

const handleSubmit = async () => {
  const { valid } = await validate()
  if (valid) {
    useBookingStore().updateBooking({
      services: selectedServices.value,
    })
    emit('next', {
      services: selectedServices.value,
    })
  }
}
</script>
<template lang="">
  <form className="flex flex-col sm:grid justify-start gap-4" @submit.prevent="handleSubmit">
    <div className="flex flex-col gap-2 overflow-hidden">
      <label className="font-medium" htmlFor=""> Vad behöver du hjälp med? </label>
      <div class="grid grid-cols-2 gap-4">
        <Service
          v-for="service in services"
          :icon="service.icon"
          :label="service.name"
          v-model="selectedServices"
        />
      </div>
      <span v-if="errorMessage" className="text-sm font-semibold text-red-500">
        {{ errorMessage }}
      </span>
    </div>
    <div class="w-1/2">
      <Button
        :class="[!meta.valid ? '!cursor-not-allowed' : '']"
        type="submit"
        label="Nästa"
        :disabled="!meta.valid"
        >Nästa</Button
      >
    </div>

    <!-- {{ selectedServices }} -->
  </form>
</template>
