import { createApp } from 'vue';
import { createPinia } from 'pinia';  // Import Pinia
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
const pinia = createPinia();  // Create Pinia instance

// Use Pinia before router
app.use(pinia);

// Then use router
app.use(router);

// Toast configuration
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

app.use(Toast, toastOptions);

app.mount('#app');