<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Stepper, Step, StepList } from 'primevue'
import { Form, useField, useForm } from 'vee-validate'
import ServiceSelection from './ServiceSelection.vue'
import MovingDate from './MovingDate.vue'
import Residence from './Residence.vue'
import CustomerInfo from './CustomerInfo.vue'
import { useRouter } from 'vue-router/auto'

const emit = defineEmits(['progress'])

const step = ref(1)

const handleSubmit = () => {
  console.log('Form submitted')
  step.value = 1
}
const router = useRouter()

const next = async (payload: any) => {
  if (step.value < 5) {
    step.value++
    console.log('Next step')
  }
  console.log('Payload:', payload)
  console.log('Step:', step.value)
  emit('progress', step.value)
}

const submit = async (payload: any) => {

  console.log('Form submitted', payload)
  router.push('/confirmation')
}

const prev = () => {
  if (step.value > 1) {
    step.value--
  }
  emit('progress', step.value)
}
</script>

<template lang="">
  <form className="flex flex-col gap-4 mt-4" @submit.prevent="handleSubmit">
    <ServiceSelection v-show="step === 1" @next="next" />
    <MovingDate v-show="step === 2" @prev="prev" @next="next" />
    <Residence v-show="step === 3" @prev="prev" @next="next" residence="Current" />
    <Residence v-show="step === 4" @prev="prev" @next="next" residence="New" />
    <CustomerInfo v-show="step === 5" @prev="prev" @next="next" @submit="submit" />
    <div className="flex gap-2">
      <!-- <Button v-if="step > 0" @click="prev()" label="Gå Tillbaka" severity="secondary" />
      <Button v-if="step < 2" @click="next()" label="Nästa" /> -->
      <!-- <Button v-if="step === 4" label="Skicka förfrågan" type="submit" /> -->
    </div>
    <!-- <p className="text-wrap">{{ values }}</p> -->
  </form>
</template>
