// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	css: ['~/assets/main.css'],
	modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/ui', '@nuxt/scripts', '@nuxthub/core'],
	nitro: {
		experimental: {
			websocket: true,
		},
	},
	hub: {
		workers: true,
	},
	ssr: false,
	devServer: {
		host: '10.0.36.10',
	},
})
