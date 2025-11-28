<script setup lang="ts">
import { ref } from 'vue'
import OfferForm from '@/components/OfferForm.vue'
import OfferOverview from '@/components/OfferOverview.vue'
import { ProgressBar, Stepper, StepList, Step, Dialog, Button } from 'primevue'
import MovingDate from '@/components/MovingDate.vue'

const showMenu = ref(false)

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

const overview = (payload: Partial<DataType>) => {
  data.value = { ...data.value, ...payload }
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

</script>

<template>
  <main class="pb-12">
    <div className="lg:w-[1200px] md:w-[600px] sm:w-[500px] w-screen grid gap-5 lg:gap-15">
      <h1 className="px-2 text-xl md:text-3xl text-center">
        Begär en kostnadsfri offert för er flytt - snabbt och enkelt!
      </h1>
      <div class="flex gap-20 justify-center">
        <div class="w-11/12 px-2 lg:w-1/2">
          <OfferForm @overview="overview" @toggleMenu="toggleMenu" />
        </div>
        <div class="hidden lg:block">
          <OfferOverview  />
        </div>
      </div>
    </div>
    <div
      :class="[
        'fixed bottom-0 right-0 w-full bg-white z-10 h-full py-10 px-3 transition-all items-center duration-500 ease-in-out transform lg:invisible',
        showMenu
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none',
      ]"
    >
      <div class="fixed top-4 right-4">
        <button @click="showMenu = false">
          <i class="pi pi-chevron-down" style="font-size: 1.5rem"></i>
        </button>
      </div>
      <div class="items-center flex flex-col mt-10">
        <OfferOverview />
        <div class="justify-end w-11/12 flex mt-5">
          <Button @click="showMenu = false" label="Gå vidare" />
        </div>
      </div>
    </div>
    <div
      class="fixed bottom-0 left-0 lg:invisible w-full h-14 bg-orange-100 items-center justify-center flex"
    >
      <button @click="toggleMenu()" class="rounded-md text-black cursor-pointer flex gap-2 items-center">
        Visa offertöversikt
        <i class="pi pi-angle-up"></i>
      </button>
    </div>
  </main>
</template>
