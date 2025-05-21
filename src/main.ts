import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import 'primeicons/primeicons.css'
import { router } from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(createPinia())

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
  locale: {
    dayNamesMin: ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'],
    monthNames: [
      'Januari',
      'Februari',
      'Mars',
      'April',
      'Maj',
      'Juni',
      'Juli',
      'Augusti',
      'September',
      'Oktober',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan', 
      'Feb',
      'Mars',
      'Apr',
      'Maj',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dec',
    ],
    firstDayOfWeek: 1,
    today: 'Idag',
  },
})

app.mount('#app')
