import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		// vue(),
		createVuePlugin(),
	],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/teplica-calc/[name].js`,
				chunkFileNames: `assets/teplica-calc/[name].js`,
				assetFileNames: `assets/teplica-calc/[name].[ext]`
			}
		}
	}
})
