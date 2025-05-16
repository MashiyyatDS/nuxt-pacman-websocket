<template>
	<UApp>
		<Ghost v-for="(ghost, key) in ghosts" :key="key" :ghost-i-d="`${key}`" :position="ghost" :active="ghost.active" />
	</UApp>
</template>

<script setup lang="ts">
const ghosts = reactive<{ [key: string]: { top: 0; left: 0; active: boolean } }>({})

const socket = new WebSocket('ws://10.0.36.10:3000/ws/socket')

const ghostID = ref('')

socket.onmessage = (event: MessageEvent) => {
	const response = JSON.parse(event.data)

	switch (response.type) {
		case 'enter':
			ghostID.value = response.ghost

			Object.assign(ghosts, response.ghosts)

			console.log(ghosts)

			break

		case 'joined':
			Object.assign(ghosts, response.ghosts)

			useToast().add({ title: 'Someone Joined' })

			break

		case 'movement':
			Object.assign(ghosts, response.ghosts)

			console.log(response.ghosts)

			break

		case 'quit':
			Object.assign(ghosts, response.ghosts)

			useToast().add({ title: 'Someone Quit lmaooo' })

			break
	}
}

document.addEventListener('keydown', (event) => {
	moveCharacter(event.key)
})

function moveCharacter(key: string) {
	switch (key) {
		case 'w':
			ghosts[ghostID.value].top -= 10

			break

		case 's':
			ghosts[ghostID.value].top += 10

			break

		case 'a':
			ghosts[ghostID.value].left -= 10

			break

		case 'd':
			ghosts[ghostID.value].left += 10

			break
	}

	socket.send(
		JSON.stringify({
			type: 'movement',
			top: ghosts[ghostID.value].top,
			left: ghosts[ghostID.value].left,
		})
	)
}
</script>

<style scoped>
.ghost {
	width: 30px;
	position: absolute;
	top: 0px;
	left: 0px;
}
</style>
