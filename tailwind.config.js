module.exports = {
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				sm: '600px',
				md: '728px',
				lg: '960px',
			},
		},
	},
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	purge: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
}
