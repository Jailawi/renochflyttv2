<script setup lang="ts">
import { ref } from 'vue'

const { icon, label, modelValue } = defineProps({
  icon: String,
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits()

const checked = ref(false)

const toggleChecked = () => {
  checked.value = !checked.value
  if (checked.value) {
    modelValue.push(label)
  } else {
    const index = modelValue.indexOf(label)
    if (index > -1) {
      modelValue.splice(index, 1)
    }
  }
  emit('update:modelValue', modelValue)
}
</script>

<template lang="">
    <button
      @click.prevent="toggleChecked()"
      :class="[
        'group grid p-5 max-w-40 max-h-40 border-1 rounded-md cursor-pointer hover:bg-gray-50 transition-all duration-300 ease-in-out',
        checked ? 'bg-orange-100 hover:bg-orange-100 border-orange-400' : 'border-slate-200',
      ]"
    >
      <div class="flex flex-col items-center justify-center gap-2">
        <img :src="icon" :alt="label" width="60" height="60" class="group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
        <span class="flex text-lg font-medium items-center justify-center">{{ label }}</span>
      </div>
    </button>
</template>
