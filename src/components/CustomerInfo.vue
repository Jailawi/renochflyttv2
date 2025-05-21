<script setup lang="ts">
import { computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import {
  FloatLabel,
  RadioButtonGroup,
  RadioButton,
  Checkbox,
  Button,
  InputText,
  InputMask,
  Textarea,
} from 'primevue'
import * as yup from 'yup'

const emit = defineEmits(['prev', 'next', 'submit'])

const customerTypes = ref([
  { label: 'Privatperson', value: 'Privatperson' },
  { label: 'Företag', value: 'Företag' },
])

const rutavdragOptions = ref([
  { label: 'Ja', value: 'Ja' },
  { label: 'Nej', value: 'Nej' },
])

const selectOption = (value: any) => {
  customerType.value = value
}

const selectRutavdrag = (value: any) => {
  rutavdrag.value = value
}

const validationSchema = computed(() =>
  yup.object({
    customerType: yup.string().required('Ange typ av kund'),
    name: yup.string().required('Ange '),
    ssn: yup.string().required('Ange '),
    rutavdrag: yup.string().when('customerType', {
      is: 'Privatperson',
      then: (schema) => schema.required('Ange om du är berättigad till rutavdrag'),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: yup.string().email('Ange en giltig e-postadress').required('Ange e-postadress'),
    phone: yup.string().min(8, 'Ange giltigt nummer').required('Ange telefonnummer'),
    message: yup.string().optional(),
    consent: yup.boolean().isTrue('Du måste godkänna integritetspolicyn').required('Du måste godkänna integritetspolicyn'),
  }),
)

const { validate, values } = useForm({ validationSchema })

const { value: customerType, errorMessage: customerTypeError } = useField<string>('customerType')
const { value: name, errorMessage: nameError } = useField('name')
const { value: ssn, errorMessage: ssnError } = useField('ssn')
const { value: rutavdrag, errorMessage: rutavdragError } = useField('rutavdrag')
const { value: email, errorMessage: emailError } = useField('email')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: message, errorMessage: messageError } = useField('message')
const { value: consent, errorMessage: consentError } = useField('consent')

const context = computed(() => ({
  name: customerType.value === 'Företag' ? 'Företagsnamn' : 'Fullständigt namn',
  ssn: customerType.value === 'Företag' ? 'Organisationsnummer' : 'Personnummer',
}))

const handleSubmit = async () => {
  if (customerType.value === 'Företag') {
    delete values.rutavdrag
  }
  const { valid } = await validate()
  if (valid) {
    emit('submit', {
      customerInfo: {
        customerType: customerType.value,
        name: name.value,
        ssn: ssn.value,
        rutavdrag: rutavdrag.value,
        email: email.value,
        phone: phone.value,
        message: message.value,
      },
    })
  }
}
</script>
<template lang="">
  <form @submit.prevent="handleSubmit">
    <h1 className="text-2xl">Era kontaktuppgifter</h1>
    <div class="flex flex-col gap-4 mt-4">
      <div className="grid gap-2">
        <div className="grid gap-2">
          <label className="font-semibold">Du är:</label>
          <RadioButtonGroup v-model="customerType" name="customerType" class="flex gap-2">
            <div
              v-for="type in customerTypes"
              @click="selectOption(type.value)"
              class="flex w-full items-center gap-2 border-1 border-gray-300 rounded-md px-2 py-3.5 cursor-pointer bg-white hover:bg-gray-100"
            >
              <RadioButton :inputId="type.value" :value="type.value" />
              <label className="cursor-pointer" :for="type.value">{{ type.value }}</label>
            </div>
          </RadioButtonGroup>
          <span className="text-sm font-semibold text-red-500" v-if="customerTypeError">
            Välj ett av alternativen
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div class="grid gap-2 w-full">
          <FloatLabel variant="in">
            <InputText id="name" v-model="name" size="small" fluid />
            <label for="name">{{ context.name }}</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="nameError">
            {{ nameError }} {{ context.name.toLowerCase() }}
          </span>
        </div>
        <div class="grid gap-2 w-full">
          <FloatLabel variant="in">
            <InputMask id="ssn" v-model="ssn" :mask="'999999-9999'" size="small" fluid />
            <label for="ssn">{{ context.ssn }}</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="ssnError">
            {{ ssnError }} {{ context.ssn.toLowerCase() }}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grid gap-2 w-full">
          <FloatLabel variant="in">
            <InputText id="email" v-model="email" type="email" size="small" fluid />
            <label for="email">Email</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="emailError">
            {{ emailError }}
          </span>
        </div>
        <div class="grid gap-2 w-full">
          <FloatLabel variant="in">
            <InputText id="phone" v-model="phone" type="number" size="small" fluid />
            <label for="phone">Telefonnummer</label>
          </FloatLabel>
          <span className="text-sm font-semibold text-red-500" v-if="phoneError">
            {{ phoneError }}
          </span>
        </div>
      </div>
      <div v-if="customerType === 'Privatperson'" className="grid gap-2">
        <label className="font-semibold">Är du berättigad till rutavdrag?</label>
        <RadioButtonGroup v-model="rutavdrag" name="rutavdrag" class="flex gap-2">
          <div
            v-for="option in rutavdragOptions"
            @click="selectRutavdrag(option.value)"
            class="flex w-full items-center gap-2 border-1 border-gray-300 rounded-md px-2 py-3.5 cursor-pointer bg-white hover:bg-gray-100"
          >
            <RadioButton :inputId="option.value" :value="option.value" />
            <label className="cursor-pointer" :for="option.value">{{ option.value }}</label>
          </div>
        </RadioButtonGroup>
        <span className="text-sm font-semibold text-red-500" v-if="rutavdragError">
          Välj ett av alternativen
        </span>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold">Övriga önskemål:</label>
        <FloatLabel variant="in">
          <Textarea id="message" v-model="message" rows="5" cols="30" fluid />
          <label for="message">Valfira kommentarer</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="messageError">
          {{ messageError }}
        </span>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="consent" inputId="consent" binary name="consent" />
          <label class="text-gray-600 font-semibold" for="consent">
            Jag godkänner<a
              href="https://www.renochflytt.se/integritetspolicy/"
              target="_blank"
              class="text-orange-500 hover:text-orange-700"
              >integritetspolicyn</a
            >
          </label>
        </div>
        <span className="text-sm font-semibold text-red-500" v-if="consentError">
          {{ consentError }}
        </span>
      </div>
      <div class="flex gap-2">
        <Button @click="emit('prev')" label="Gå Tillbaka" severity="secondary" />
        <Button type="submit" label="Skicka förfrågan" />
      </div>
    </div>
    <!-- {{ values }} -->
  </form>
</template>
