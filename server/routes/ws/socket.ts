import type { Peer } from 'crossws'
import { reactive } from 'vue'

const channel = 'SOCKET_CHANNEL'

interface GhostInterface {
	top: number
	left: number
	active: boolean
	name: string
}

interface Ghosts {
	[key: string]: GhostInterface
}

const ghosts = reactive<{ [key: string]: GhostInterface }>({})

export default defineWebSocketHandler({
	message(peer, message) {
		const request = JSON.parse(message.text())

		switch (request.type) {
			case 'movement':
				onMessage(peer).movement(request)

				break

			case 'join':
				onMessage(peer).join({ name: request.name })

				publishMessage(peer).joined({ ghosts, name: request.name })

				sendMessage(peer).enter({ ghost: peer.id, ghosts })

				break
		}
	},
	close(peer) {
		console.log(peer.id, 'Connection CLosed')

		onMessage(peer).quit()
	},
})

const onMessage = (peer: Peer) => ({
	movement: (request: { type: string; left: number; top: number }) => {
		ghosts[peer.id].left = request.left
		ghosts[peer.id].top = request.top

		publishMessage(peer).movement({ ghost: peer.id, ghosts })

		sendMessage(peer).movement({ ghost: peer.id, ghosts })
	},
	quit: () => {
		ghosts[peer.id].active = false

		publishMessage(peer).quit({ ghost: peer.id, ghosts })

		sendMessage(peer).quit({ ghost: peer.id, ghosts })
	},
	join: (request: { name: string }) => {
		peer.subscribe(channel)

		Object.assign(ghosts, {
			[peer.id]: { top: 0, left: 0, active: true, name: request.name },
		})
	},
})

const sendMessage = (peer: Peer) => ({
	movement: (request: { ghost: string; ghosts: Ghosts }) => {
		peer.send(JSON.stringify({ type: 'movement', ...request }))
	},
	quit: (request: { ghost: string; ghosts: Ghosts }) => {
		peer.send(JSON.stringify({ type: 'quit', ...request }))
	},
	enter: (request: { ghost: string; ghosts: Ghosts }) => {
		peer.send(JSON.stringify({ type: 'enter', ...request }))
	},
})

const publishMessage = (peer: Peer) => ({
	movement: (request: { ghost: string; ghosts: Ghosts }) => {
		peer.publish(channel, JSON.stringify({ type: 'movement', ...request }))
	},
	quit: (request: { ghost: string; ghosts: Ghosts }) => {
		peer.publish(channel, JSON.stringify({ type: 'quit', ...request }))
	},
	joined: (request: { ghosts: Ghosts; name: string }) => {
		peer.publish(channel, JSON.stringify({ type: 'joined', ...request }))
	},
})
