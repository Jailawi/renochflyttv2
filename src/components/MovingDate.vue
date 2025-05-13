<script setup lang="ts">
import { computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { FloatLabel, DatePicker, RadioButtonGroup, RadioButton, Button } from 'primevue'
import * as yup from 'yup'

const emit = defineEmits(['prev', 'next'])

const flexibleOptions = ref([
  { label: 'Ja', value: 'Ja' },
  { label: 'Nej', value: 'Nej' },
])

const selectOption = (value: any) => {
  flexibleOption.value = value
}

const validationSchema = yup.object({
  movingDate: yup.string().required('Flyttdatum är obligatoriskt'),
  flexible: yup.string().required('Ange om flyttdatum är flexibelt'),
})

const { validate, values } = useForm({
  validationSchema,
})

const { value: selectedDate, errorMessage: dateError } = useField<string>('movingDate')
const { value: flexibleOption, errorMessage: radioError } = useField('flexible')

const formatDate = ref(selectedDate.value ? new Date(selectedDate.value) : undefined)

function setDate(date: Date) {
  selectedDate.value = date.toLocaleDateString('sv-SE')
}

const handleSubmit = async () => {
  const { valid } = await validate()
  if (valid) {
    emit('next', {
      movingDate: selectedDate.value,
      flexible: flexibleOption.value,
    })
  }
}


</script>
<template lang="">
  <form @submit.prevent="handleSubmit">
    <h1 className="text-2xl">Vi Flyttar den..</h1>
    <h3 className="text-medium">
      Ange ett preliminärt datum för er flytt. Om flexibelt flyttdatum önskas så kan detta väljas
      nedan.
    </h3>

    <div class="flex flex-col gap-4 mt-4">
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="in_label"> Välj datum </label>
        <FloatLabel variant="in">
          <DatePicker
            v-model="formatDate"
            size="small"
            fluid
            inputId="in_label"
            showIcon
            dateFormat="dd/mm/yy"
            iconDisplay="input"
            @update:model-value="setDate"
          />
          <label for="in_label">Flyttdatum</label>
        </FloatLabel>
        <span className="text-sm font-semibold text-red-500" v-if="dateError">
          Vänligen välj ett datum
        </span>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold">Är ditt flyttdatum flexibelt?</label>
        <RadioButtonGroup v-model="flexibleOption" name="flexible" class="flex gap-2">
          <div
            v-for="option in flexibleOptions"
            @click="selectOption(option.value)"
            class="flex w-full items-center gap-2 border-1 border-gray-300 rounded-md px-2 py-3.5 cursor-pointer bg-white hover:bg-gray-100"
          >
            <RadioButton :inputId="option.value" :value="option.value" />
            <label className="cursor-pointer" :for="option.value">{{ option.value }}</label>
          </div>
        </RadioButtonGroup>
        <span className="text-sm font-semibold text-red-500" v-if="radioError">
          Välj ett av alternativen
        </span>
      </div>
      <div class="flex gap-2">
        <Button @click="emit('prev')" label="Gå Tillbaka" severity="secondary" />
        <Button type="submit" label="Nästa" />
      </div>
    </div>
    <!-- {{ values }} -->
  </form>
</template>
