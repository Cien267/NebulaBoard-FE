import './assets/css/main.css'
import Material from '@primeuix/themes/material'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { definePreset } from '@primeuix/themes'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
  },
})
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: { darkModeSelector: false },
  },
})
app.use(ToastService)
app.directive('tooltip', Tooltip)

app.mount('#app')
