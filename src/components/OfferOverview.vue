<script setup lang="ts">
import { value } from '@primeuix/themes/aura/knob';
import { Divider } from 'primevue'
import { date } from 'yup';
import { storeToRefs } from 'pinia';
import { useBookingStore } from '@/stores/booking'

const props = defineProps({
    movingDate: {
        type: String,
    },
    flexibleDate: {
        type: String,
    },
    area: {
        type: Number,
    },
})

const overviewFields = [
  {
    label: 'Önskat datum',
    id: 'movingDate'
  },
  {
    label: 'Flexibelt datum',
    id: 'flexibleDate'
  },
  {
    label: 'Antal kvm',
    id: 'currentAddress.area'
  },
]
const store = useBookingStore()
const {booking} = storeToRefs(store)

const getNestedValue = (obj: any, path: string): any  =>{
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}


</script>
<template>
  <div class="flex flex-col gap-5 w-11/12 lg:w-[30vw]">
    <div
      class="flex flex-col gap-10 p-5 rounded-lg border border-gray-300 bg-gray-50 h-[320px]"
    >
      <h1 class="text-2xl font-medium text-gray-700">Offertöversikt</h1>
      <div class="flex flex-col gap-3">
        <div v-for="field in overviewFields" :key="field.id" class="flex justify-between w-full">
          <p class="text-gray-600">{{ field.label }}</p>
          <p class="font-semibold"> {{ getNestedValue(booking, field.id) ?? '-' }}</p>
        </div>
        <Divider />
        <div class="flex justify-between w-full">
          <div class="flex flex-col gap-1">
            <p class="text-gray-600">Totalt</p>
            <p class="text-gray-600 text-xs">Inkl. Rutavdrag</p>
          </div>
          <p class="font-semibold">Lämnas vid offert</p>
        </div>
      </div>
    </div>
    <p class="text-gray-600 text-xs">* Detta pris är preliminärt och kan komma att justeras för att anpassa vår tjänst efter dina behov. Priset blir inte bindande förrän den officiella offerten är signerad.</p>
  </div>
</template>
