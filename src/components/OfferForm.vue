<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Stepper, Step, StepList } from 'primevue'
import { Form, useField, useForm } from 'vee-validate'
import ServiceSelection from './ServiceSelection.vue'
import MovingDate from './MovingDate.vue'
import Residence from './Residence.vue'
import CustomerInfo from './CustomerInfo.vue'
import { useRouter } from 'vue-router/auto'

const emit = defineEmits(['progress', 'overview'])

const step = ref(1)

type DataKeys = 'services' | 'moving' | 'residenceCurrent' | 'residenceNew' | 'customerInfo'

interface DataType {
  services: any[]
  moving: Record<string, any>
  residenceCurrent: Record<string, any>
  residenceNew: Record<string, any>
  customerInfo: Record<string, any>
}

const data = ref<DataType>({
  services: [],
  moving: {},
  residenceCurrent: {},
  residenceNew: {},
  customerInfo: {},
})

const router = useRouter()

const next = async (payload: any) => {
  if (step.value < 5) {
    step.value++
  }
  const key = Object.keys(payload)[0] as DataKeys
  data.value[key] = payload[key]
  emit('progress', step.value)
}

const submit = async (payload: any) => {
  const key = Object.keys(payload)[0] as DataKeys
  data.value[key] = payload[key]
  console.log('Form submitted', data.value)
  router.push('/confirmation')
}

const prev = () => {
  if (step.value > 1) {
    step.value--
  }
  emit('progress', step.value)
}

const sendData = (payload: any) => {
  emit('overview', payload)
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
    <MovingDate v-show="step === 2" @prev="prev" @next="next" @sendData="sendData" />
    <Residence v-show="step === 3" @prev="prev" @next="next" residence="Current" />
    <Residence v-show="step === 4" @prev="prev" @next="next" residence="New" />
    <CustomerInfo v-show="step === 5" @prev="prev" @next="next" @submit="submit" />
    <div className="flex gap-2">
      <!-- <Button v-if="step > 0" @click="prev()" label="Gå Tillbaka" severity="secondary" />
      <Button v-if="step < 2" @click="next()" label="Nästa" /> -->
      <!-- <Button v-if="step === 4" label="Skicka förfrågan" type="submit" /> -->
    </div>
    <!-- <p className="text-wrap">{{ values }}</p> -->
  </div>
</template>
