<script setup lang="ts">
import { h, ref } from 'vue'
import OfferForm from '../components/OfferForm.vue'
import OfferOverview from '../components/OfferOverview.vue'
import { ProgressBar, Stepper, StepList, Step, Dialog, Button } from 'primevue'
import MovingDate from '@/components/MovingDate.vue'

const progress = ref(1)

const toggleMenu = ref(false)

type DataType = {
  movingDate: string
  flexibleDate: null | boolean
  area: null | number
}

const data = ref<DataType>({
  movingDate: '',
  flexibleDate: null,
  area: null
})

const handleProgress = (step: number) => {
  progress.value = step
}

const overview = (payload: Partial<DataType>) => {
  console.log('Overview data:', payload)
  data.value = { ...data.value, ...payload }
}
</script>

<template>
  <main class="py-5">
    <div className="lg:w-[1200px] md:w-[600px] sm:w-[500px] w-[400px] grid gap-5">
      <!-- <ProgressBar :value="progress"></ProgressBar> -->
      <h1 className="text-4xl text-center">
        Begär en kostnadsfri offert för er flytt – snabbt och enkelt!
      </h1>
      <div class="flex gap-20 justify-center">
        <div class="w-11/12 px-2 lg:w-1/2">
          <!-- <Stepper :value="progress" linear>
            <StepList>
              <Step :value="1"></Step>
              <Step :value="2"></Step>
              <Step :value="3"></Step>
              <Step :value="4"></Step>
              <Step :value="5"></Step>
            </StepList>
          </Stepper> -->
          <OfferForm @progress="handleProgress" @overview="overview" />
        </div>
        <div class="hidden lg:block">
          <OfferOverview :movingDate="data.movingDate" :flexibleDate="typeof data.flexibleDate === 'boolean' ? String(data.flexibleDate) : undefined" />
        </div>
      </div>
    </div>
    <div
      :class="[
        'fixed bottom-0 right-0 w-full bg-white z-10 flex h-screen py-10 px-3 transition-all items-center duration-500 ease-in-out transform lg:invisible flex-col gap-20',
        toggleMenu
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none',
      ]"
    >
      <div class="flex justify-end items-center w-full">
        <button @click="toggleMenu = false">
          <i class="pi pi-times" style="font-size: 1.5rem"></i>
        </button>
      </div>
      <OfferOverview />
    </div>
    <div
      class="fixed bottom-0 left-0 lg:invisible w-full h-14 bg-orange-100 items-center justify-center flex"
    >
      <button @click="toggleMenu = !toggleMenu" class="rounded-md text-black cursor-pointer">
        Visa offertöversikt
      </button>
    </div>
  </main>
</template>
