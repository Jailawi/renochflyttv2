<script setup lang="ts">
import { ref } from 'vue'
import OfferForm from '../components/OfferForm.vue'
import { ProgressBar, Stepper, StepList, Step } from 'primevue'

const progress = ref(1)

const handleProgress = (value: number) => {
  progress.value = value
}
</script>

<template>
  <main>
    <div className=" lg:w-[700px] sm:w-[500px] grid gap-4">
      <!-- <ProgressBar :value="progress"></ProgressBar> -->
      <h1 className="text-4xl ">Bokningsförfrågan</h1>
      <div>
        <Stepper :value="progress" linear>
          <StepList>
            <Step :value="1"></Step>
            <Step :value="2"></Step>
            <Step :value="3"></Step>
            <Step :value="4"></Step>
            <Step :value="5"></Step>
          </StepList>
        </Stepper>
        <OfferForm @progress="handleProgress" />
      </div>
    </div>
  </main>
</template>
