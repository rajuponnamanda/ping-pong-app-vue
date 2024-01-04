import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import i18n from './components/locale/i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast)
const appInsights = new ApplicationInsights({
  config:{
    connectionString: 'InstrumentationKey=335550e5-3b0a-4b45-b7ae-27bb59362055',
    enableAutoRouteTracking: true, // Optional, automatically track route changes
    enableRequestHeaderTracking: true, // Optional, track request headers
    enableResponseHeaderTracking: true // Optional, track response headers
  }
})
appInsights.loadAppInsights()
appInsights.trackPageView()
app.config.globalProperties.$appInsights = appInsights as ApplicationInsights | undefined // Make appInsights available globally

app.use(i18n)
app.mount('#app')


