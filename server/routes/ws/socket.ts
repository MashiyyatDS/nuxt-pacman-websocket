import { reactive } from 'vue'

const channel = 'SOCKET_CHANNEL'

const ghosts = reactive<{ [key: string]: { top: 0; left: 0; active: boolean } }>({})

export default defineWebSocketHandler({
	open(peer) {
		peer.subscribe(channel)

		Object.assign(ghosts, {
			[peer.id]: {
				top: 0,
				left: 0,
				active: true,
			},
		})

		peer.publish(
			channel,
			JSON.stringify({
				type: 'joined',
				ghosts,
			})
		)

		peer.send(
			JSON.stringify({
				type: 'enter',
				message: 'Welcome',
				ghost: peer.id,
				ghosts,
			})
		)
	},
	message(peer, message) {
		const request = JSON.parse(message.text())

		switch (request.type) {
			case 'movement':
				ghosts[peer.id].left = request.left
				ghosts[peer.id].top = request.top

				peer.publish(
					channel,
					JSON.stringify({
						type: 'movement',
						ghost: peer.id,
						ghosts,
					})
				)

				peer.send(
					JSON.stringify({
						type: 'movement',
						ghost: peer.id,
						ghosts,
					})
				)

				break
		}
	},
	close(peer) {
		console.log(peer.id, 'Connection CLosed')

		ghosts[peer.id].active = false

		peer.publish(
			channel,
			JSON.stringify({
				type: 'quit',
				ghost: peer.id,
				ghosts,
			})
		)

		peer.send(
			JSON.stringify({
				type: 'quit',
				ghost: peer.id,
				ghosts,
			})
		)
	},
})
