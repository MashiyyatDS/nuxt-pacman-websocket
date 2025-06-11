import { buildSchema, graphql } from 'graphql'
import { readBody } from 'h3'

const schema = buildSchema(`
type User {
	first_name: String
	middle_name: String
	last_name: String
	email: String
	age: Int
}

type Query {
	users: [User]
	user(age: Int!): User
}	

input UserInput { 
	first_name: String
	middle_name: String
	last_name: String
	email: String
	age: Int!
}

type Mutation {
	addUser(input: UserInput): User
}
`)

type User = {
	first_name: string
	middle_name: string
	last_name: string
	email: string
	age: number
}

const rootValue = {
	async users() {
		return await $fetch('https://retoolapi.dev/VEplD7/data')
	},
	user(args: { age: number }) {
		return {
			first_name: 'Mashiyyat',
			middle_name: 'Villasenor',
			last_name: 'Delos Santos',
			email: 'delossantos.mash@gmail.com',
			age: args.age,
		}
	},
	addUser(args: { input: User }) {
		return args.input
	},
}

export default defineEventHandler(async (event) => {
	const method = event.node.req.method

	let query: string | undefined
	let variables = undefined
	let operationName: string | undefined

	if (method === 'POST') {
		const body = await readBody(event)
		query = body.query
		variables = body.variables
		operationName = body.operationName
	}

	if (!query) {
		sendError(event, createError({ statusCode: 404, message: 'Page not found' }))

		return
	}

	const result = await graphql({
		schema,
		source: query,
		rootValue,
		variableValues: variables,
		operationName,
	})

	return result
})
