import './assets/main.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'
import '/node_modules/primeflex/themes/primeone-light.css'

import { initializeApp } from "firebase/app";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Menubar from 'primevue/menubar';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import RadioButton from 'primevue/radiobutton';

import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyCMQprxBxNgR81Gz2_-vLZpJcub157ydZE",
    authDomain: "to-do-64b79.firebaseapp.com",
    projectId: "to-do-64b79",
    storageBucket: "to-do-64b79.firebasestorage.app",
    messagingSenderId: "488772729376",
    appId: "1:488772729376:web:a8c5ca77e3a1ebabad9a45"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.component('app-menubar', Menubar)
app.component('app-ifta-label', IftaLabel)
app.component('app-input-text', InputText)
app.component('app-textarea', Textarea)
app.component('app-button', Button)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-dialog', ConfirmDialog)
app.component('app-accordion', Accordion)
app.component('app-accordion-panel', AccordionPanel)
app.component('app-accordion-header', AccordionHeader)
app.component('app-accordion-content', AccordionContent)
app.component('app-radio', RadioButton)


app.mount('#app')
