<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
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
  title: residence === 'Current' ? 'Vi Flyttar från..' : 'Vi Flyttar till..',
  adress: residence === 'Current' ? 'Nuvarande adress' : 'Ny adress',
  description: residence === 'Current' ? 'nuvarande adress' : 'nya adress',
  adressValidation: residence === 'Current' ? 'Ange nuvarande adress' : 'Ange flyttadress',
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
  area: yup
    .number()
    .typeError('Ange bostads storlek')
    .required('Ange bostads storlek')
    .positive('Ange en positiv siffra')
    .integer('Ange ett heltal'),
  floor: yup
    .number()
    .typeError('Ange våning')
    .positive('Ange en positiv siffra')
    .integer('Ange ett heltal')
    .nullable()
    .optional(),
  access: yup.string().required('Ange tillgång'),
})

const { validate, values } = useForm({ validationSchema })

const { value: address, errorMessage: adressError } = useField<string>('address')
const { value: type, errorMessage: typeError } = useField<string>('type')
const { value: area, errorMessage: areaError } = useField<string>('area')
const { value: floor, errorMessage: floorError } = useField<string>('floor')
const { value: access, errorMessage: accessError } = useField<string>('access')

const handleSubmit = async () => {
  const { valid } = await validate()
  if (valid) {
    emit('next', {
      [residence]: {
        address: address.value,
        type: type.value,
        area: area.value,
        floor: floor.value,
        access: access.value,
      }
    })
  }
}

const inputText = ref()

onMounted(() => {
  const input = inputText.value.$el
  input.placeholder = ''
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    fields: ['address_components'],
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    address.value = place.formatted_address || input.value
  })
})
</script>

<template lang="">
  <form @submit.prevent="handleSubmit">
    <h1 className="text-2xl">{{context.title}}</h1>
    <h3 className="">Berätta lite om er {{ context.description }}.</h3>
    <div class="flex flex-col gap-4 mt-4">
      <div class="grid gap-2">
        <FloatLabel variant="in">
          <InputText id="in_label" v-model="address" size="small" fluid ref="inputText" />
          <label for="Adress">{{ context.adress }}</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="adressError">
          {{ adressError }}
        </span>
      </div>
      <div class="grid gap-2">
        <label class="font-semibold" for="type">Typ av bostad</label>
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
      <div class="grid gap-2">
        <FloatLabel variant="in" class="">
          <!-- <InputNumber v-model="area" inputId="area" mode="currency" currency="USD" locale="en-US" variant="filled" /> -->
          <InputText v-model="area" inputId="area" type="number" step="1" fluid @keydown="(event) => blockedNumberChars.includes(event.key) && event.preventDefault()" />
          <label for="area">Bostads storlek (kvm)</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="areaError">
          {{ areaError }}
        </span>
      </div>
      <div class="grid gap-2">
        <div className="flex gap-2">
          <FloatLabel variant="in" class="w-1/2">
            <Select v-model="access" inputId="access" :options="accessOptions" fluid />
            <label for="access">Tillgång</label>
          </FloatLabel>
          <FloatLabel v-if="type === 'Lägenhet'" class="w-1/2" variant="in">
            <InputNumber v-model="floor" inputId="floor" :useGrouping="false" fluid />
            <label for="floor">Våningsplan</label>
          </FloatLabel>
        </div>
        <span className="text-sm font-semibold text-red-500" v-if="accessError">
          {{ accessError }}
        </span>
      </div>
      <!-- {{ values }} -->

      <div class="flex gap-2">
        <Button type="button" label="Gå Tillbaka" severity="secondary" @click="emit('prev')" />
        <Button type="submit" label="Nästa" />
      </div>
    </div>
  </form>
</template>
