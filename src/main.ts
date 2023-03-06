import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import { initYandexMetrika } from "yandex-metrika-vue3";

createApp(App)
	.use(initYandexMetrika, {
		id: 87154355,
		clickmap:true,
		trackLinks:true,
		accurateTrackBounce:true,
		webvisor:true,
		env: process.env.NODE_ENV
	})
	.mount("#app");
