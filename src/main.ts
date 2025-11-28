import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import 'primeicons/primeicons.css'
import { router } from './router'
import { createPinia } from 'pinia'
import axios from 'axios'

const app = createApp(App)
app.use(router)
app.use(createPinia())

// In development, use empty baseURL so Vite proxy can handle requests
// In production, use the full API URL
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

axios.defaults.baseURL = baseURL
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

window.dataLayer = window.dataLayer || [];

const loadGoogleMapsApi = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};

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

loadGoogleMapsApi().then(() => {
  app.mount('#app');
})
.catch((error) => {
  console.error('Error loading Google Maps API:', error);
  app.mount('#app');
});
