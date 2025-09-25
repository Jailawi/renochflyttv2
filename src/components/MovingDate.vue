<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { FloatLabel, DatePicker, RadioButtonGroup, RadioButton, Button } from 'primevue'
import * as yup from 'yup'
import { useBookingStore } from '@/stores/booking'

const emit = defineEmits(['prev', 'next'])

const bookingStore = useBookingStore()

const services = computed(() => bookingStore.booking.services || [])

const flexibleOptions = ref([
  { label: 'Ja', value: true },
  { label: 'Nej', value: false },
])

const selectOption = (value: any) => {
  isFlexibleDate.value = value
}

const validationSchema = computed(() => yup.object({
  movingDate: yup.string().required('Flyttdatum är obligatoriskt'),
  cleaningDate: services.value.includes('Flyttstädning')
    ? yup.string().required('Flyttstädning kräver ett datum')
    : yup.string().notRequired(),
  isFlexibleDate: yup.boolean().required('Ange om flyttdatum är flexibelt'),
}))

const { validate, values, meta } = useForm({
  validationSchema,
})

const { value: movingDate, errorMessage: movingDateError } = useField<string>('movingDate')
const { value: cleaningDate, errorMessage: cleaningDateError } = useField<string>('cleaningDate')
const { value: isFlexibleDate, errorMessage: radioError } = useField<boolean>('isFlexibleDate')

// const formatDate = ref(movingDate.value ? new Date(movingDate.value) : undefined)

function setMovingDate(date: Date) {
  movingDate.value = date?.toLocaleDateString('sv-SE')
}

function setCleaningDate(date: Date) {
  cleaningDate.value = date?.toLocaleDateString('sv-SE')
}

const handleSubmit = async () => {
  const { valid } = await validate()
  if (valid) {
    useBookingStore().updateBooking({
      moving_date: movingDate.value,
      is_flexible_date: isFlexibleDate.value,
      cleaning_date: cleaningDate.value,
    })
    emit('next')
  }
}

watch(movingDate, (newValue) => {
  useBookingStore().updateBooking({
    moving_date: newValue,
  })
})
watch(isFlexibleDate, (newValue) => {
  useBookingStore().updateBooking({
    is_flexible_date: newValue,
  })
})
</script>
<template lang="">
  <form @submit.prevent="handleSubmit">
    <h1 className="text-2xl">Vi Flyttar den..</h1>
    <h3 className="text-medium">
      Ange ett preliminärt datum för er flytt. Om flexibelt flyttdatum önskas så kan detta väljas
      nedan.
    </h3>

    <div class="grid gap-4 mt-4">
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="in_label"> Välj datum </label>
        <div>
          <FloatLabel variant="in" class="rounded-md">
            <!-- v-model="formatDate" -->
            <DatePicker
              size="small"
              fluid
              inputId="in_label"
              showIcon
              dateFormat="dd/mm/yy"
              iconDisplay="input"
              @update:model-value="setMovingDate"
            />
            <label for="in_label">Flyttdatum</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="movingDateError">
            Vänligen välj ett flyttdatum
          </span>
        </div>
        <div v-if="services.includes('Flyttstädning')">
          <FloatLabel variant="in" class="rounded-md">
            <!-- v-model="formatDate" -->
            <DatePicker
              size="small"
              fluid
              inputId="in_label"
              showIcon
              dateFormat="dd/mm/yy"
              iconDisplay="input"
              @update:model-value="setCleaningDate"
            />
            <label for="in_label">Städdatum</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="cleaningDateError">
            Vänligen välj ett städdatum
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold">Är ditt flyttdatum flexibelt?</label>
        <RadioButtonGroup v-model="isFlexibleDate" name="flexible" class="flex gap-2">
          <div
            v-for="option in flexibleOptions"
            @click="selectOption(option.value)"
            class="flex w-full items-center gap-2 border-1 border-gray-300 rounded-md px-2 py-3.5 cursor-pointer bg-white hover:bg-gray-100"
          >
            <RadioButton :inputId="option.label" :value="option.value" />
            <label className="cursor-pointer" :for="option.label">{{ option.label }}</label>
          </div>
        </RadioButtonGroup>
        <span className="text-sm font-semibold text-red-500" v-if="radioError">
          Välj ett av alternativen
        </span>
      </div>
      <div class="flex gap-2">
        <Button @click="emit('prev')" label="Gå Tillbaka" severity="secondary" />
        <Button 
        :class="[!meta.valid ? '!cursor-not-allowed' : '']"
        :disabled="!meta.valid"
        type="submit"
        label="Nästa" />
      </div>
    </div>
    <!-- {{ values }} -->
  </form>
</template>
