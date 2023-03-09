import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import VueYandexMetrika from "vue3-yandex-metrika";

createApp(App)
	.use(VueYandexMetrika, {
		id: "87154355",
		options: {
			clickmap:true,
			trackLinks:true,
			accurateTrackBounce:true,
			webvisor:true,
		},
		env: "production"
	})
	.mount("#app");
