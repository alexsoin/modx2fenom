import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueClipboard from 'vue-clipboard2'
import App from './App.vue';

import './styles.scss';

Vue.use(Toast);
Vue.use(VueClipboard);
Vue.use(VueHotkey);

new Vue({
	render: (h) => h(App),
}).$mount('#app');
