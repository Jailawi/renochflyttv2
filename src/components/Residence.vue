<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'

declare global {
  interface Window {
    initMap: () => void;
  }
}

import {
  Button,
  AutoComplete,
  InputText,
  FloatLabel,
  RadioButtonGroup,
  RadioButton,
  InputNumber,
  Select,
} from 'primevue'
import * as yup from 'yup'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()

const { residence } = defineProps({
  residence: {
    type: String,
    required: true,
  },
})

const residenceTypes = ref([
  { label: 'Lägenhet', value: 'Lägenhet' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Radhus', value: 'Radhus' },
])

const context = {
  title: residence === 'current' ? 'Vi Flyttar från..' : 'Vi Flyttar till..',
  adress: residence === 'current' ? 'Nuvarande adress' : 'Ny adress',
  description: residence === 'current' ? 'nuvarande adress' : 'nya adress',
  adressValidation: residence === 'current' ? 'Ange nuvarande adress' : 'Ange flyttadress',
}

const accessOptions = ref(['Liten Hiss', 'Medelstor Hiss', 'Stor Hiss', 'Trappor', 'Entreplan'])

const blockedNumberChars = [',', '.', 'e', '-']

const emit = defineEmits(['prev', 'next'])

const selectOption = (value: any) => {
  type.value = value
}

const validationSchema = yup.object({
  address: yup.string().required(context.adressValidation),
  type: yup.string().required('Ange typ av bostad'),
  area:
    residence === 'current'
      ? yup
          .number()
          .typeError('Ange bostads storlek')
          .required('Ange bostads storlek')
          .positive('Ange en positiv siffra')
          .integer('Ange ett heltal')
      : yup.number().notRequired(),
  floor: yup.number().when('type', {
    is: 'Lägenhet',
    then: (schema: any) =>
      schema
        .typeError('Ange våning')
        .required('Ange våning')
        .min(0, 'Ange våning 0 eller högre')
        .integer('Ange ett heltal'),
    otherwise: (schema: any) => schema.notRequired(),
  }),
  access: yup.string().required('Ange tillgång'),
})

const { validate, values, meta } = useForm({ validationSchema })

const { value: address, errorMessage: adressError } = useField<string>('address')
const { value: type, errorMessage: typeError } = useField<string>('type')
const { value: area, errorMessage: areaError } = useField<number>('area')
const { value: floor, errorMessage: floorError } = useField<number>('floor')
const { value: access, errorMessage: accessError } = useField<string>('access')

const handleSubmit = async () => {
  const { valid } = await validate()
  if (valid) {
    bookingStore.updateBooking({
      [residence + '_address']: {
        address: address.value,
        residence_type: type.value,
        living_area: area.value,
        floor: floor.value,
        accessibility: access.value,}
    })
    emit('next')
  }
}

const inputText = ref()

const initMap = () => {
  const swedenBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(55.0, 11.0), // Southwest corner
    new google.maps.LatLng(69.0, 24.2), // Northeast corner
  )
  google.maps.event.trigger(inputText.value.$el, 'focus')
  const input = inputText.value.$el
  input.placeholder = ''
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    fields: ['address_components', 'formatted_address'],
    bounds: swedenBounds,
    strictBounds: false,
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()

    address.value = place.formatted_address || input.value
  })
}

onMounted(() => {
  if (window.google && window.google.maps) {
    // Google Maps already loaded
    initMap();
  } else {
    // Set callback for when script loads
    window.initMap = initMap;
    initMap();
  }
})

watch(area, (newArea: number) => {
  if (residence === 'current') {
    bookingStore.updateBooking({
      current_address: {
        living_area: newArea,
      }
    })
  }
})
</script>

<template lang="">
  <form @submit.prevent="handleSubmit">
    <h1 className="text-2xl">{{ context.title }}</h1>
    <h3 className="">Berätta lite om er {{ context.description }}.</h3>
    <div class="flex flex-col gap-4 mt-4">
      <div class="grid gap-2">
        <FloatLabel variant="in">
          <InputText
            class="!text-base"
            id="in_label"
            autocomplete="none"
            v-model="address"
            size="small"
            fluid
            ref="inputText"
          />
          <label id="Adress">{{ context.adress }}</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="adressError">
          {{ adressError }}
        </span>
      </div>
      <div class="grid gap-2">
        <label class="font-semibold">Typ av bostad</label>
        <RadioButtonGroup v-model="type" name="ingredient" class="flex gap-4">
          <div
            v-for="type in residenceTypes"
            @click="selectOption(type.value)"
            className="flex w-full items-center gap-2 border-1 border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 bg-white"
          >
            <RadioButton :inputId="type.value" :value="type.value" />
            <label className="cursor-pointer" :for="type.value">{{ type.label }}</label>
          </div>
        </RadioButtonGroup>
        <span className="text-sm font-semibold text-red-500" v-if="typeError">
          {{ typeError }}
        </span>
      </div>
      <div v-if="residence === 'current'" class="grid gap-2">
        <FloatLabel variant="in" class="">
          <InputText
            v-model.number="area"
            inputId="area"
            type="number"
            step="1"
            fluid
            @keydown="(event) => blockedNumberChars.includes(event.key) && event.preventDefault()"
          />
          <label id="area">Bostads storlek (kvm)</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="areaError">
          {{ areaError }}
        </span>
      </div>
      <div class="grid gap-2">
        <div className="flex gap-2">
          <div class="w-1/2">
            <FloatLabel variant="in">
              <Select v-model="access" inputId="access" :options="accessOptions" fluid />
              <label id="access">Tillgång</label>
            </FloatLabel>
            <span className="text-sm font-semibold text-red-500" v-if="accessError">
              {{ accessError }}
            </span>
          </div>
          <div class="w-1/2">
            <FloatLabel v-if="type === 'Lägenhet'" variant="in">
              <InputText
                v-model.number="floor"
                inputId="floor"
                type="number"
                step="1"
                fluid
                @keydown="(event) => blockedNumberChars.includes(event.key) && event.preventDefault()"
              />
              <label for="floor">Våningsplan</label>
            </FloatLabel>
            <span className="text-sm font-semibold text-red-500" v-if="floorError">
              {{ floorError }}
            </span>
          </div>
        </div>
      </div>
      <!-- {{ values }} -->

      <div class="flex gap-2">
        <Button type="button" label="Gå Tillbaka" severity="secondary" @click="emit('prev')" />
        <Button
        :class="[!meta.valid ? '!cursor-not-allowed' : '']"
        :disabled="!meta.valid"
        type="submit"
        label="Nästa" />
      </div>
    </div>
  </form>
</template>
