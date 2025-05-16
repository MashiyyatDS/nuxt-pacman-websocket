export default defineEventHandler(async () => {
	const response = $fetch('https://retoolapi.dev/VEplD7/data')

	return response
})
