import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	plugins: [vue()],
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
	},
});
