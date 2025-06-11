<template>
	<UApp>
		<Ghost v-for="(ghost, key) in ghosts" :key="key" :ghost-i-d="`${key}`" :position="ghost" :active="ghost.active" :name="ghost.name" />

		<UModal v-model:open="open" title="Enter your name to join" :dismissible="false">
			<template #description />

			<template #body>
				<UInput v-model="ghostName" placeholder="Enter your name" class="w-full" />
			</template>

			<template #footer>
				<UButton label="Join" @click="join" />
			</template>
		</UModal>
	</UApp>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
const ghosts = reactive<{ [key: string]: { top: 0; left: 0; active: boolean; name: string } }>({})

const open = ref(true)

const ghostID = ref('')
const ghostName = ref('')
const { send } = useWebSocket('/ws/socket', {
	onMessage: (ws, event) => {
		const response = JSON.parse(event.data)

		switch (response.type) {
			case 'enter':
				ghostID.value = response.ghost

				Object.assign(ghosts, response.ghosts)

				break

			case 'joined':
				Object.assign(ghosts, response.ghosts)

				useToast().add({ title: `${response.name} joined the game` })

				break

			case 'movement':
				Object.assign(ghosts, response.ghosts)

				break

			case 'quit':
				Object.assign(ghosts, response.ghosts)

				useToast().add({ title: 'Someone Quit lmaooo' })

				break
		}
	},
})

document.addEventListener('keydown', (event) => {
	moveCharacter(event.key)
})

function moveCharacter(key: string) {
	if (!ghostID.value) return

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

	send(
		JSON.stringify({
			type: 'movement',
			top: ghosts[ghostID.value].top,
			left: ghosts[ghostID.value].left,
		})
	)
}

function join() {
	send(
		JSON.stringify({
			type: 'join',
			name: ghostName.value,
		})
	)

	open.value = false
}
</script>
