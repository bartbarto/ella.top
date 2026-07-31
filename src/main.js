import { createApp } from 'vue';
import App from './App.vue';
import { startFaviconAnimation } from './favicon.js';
import './style.css';

startFaviconAnimation();
createApp(App).mount('#app');
