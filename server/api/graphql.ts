import { buildSchema, graphql } from 'graphql'
import { readBody, getQuery } from 'h3'

const schema = buildSchema(`
  type User {
    first_name: String
    middle_name: String
    last_name: String
    email: String
  }

  type Query {
    users: [User]
	user: User
  }
`)

const rootValue = {
	async users() {
		return await $fetch('https://retoolapi.dev/VEplD7/data')
	},
	user() {
		return {
			first_name: 'Mashiyyat',
			middle_name: 'Villasenor',
			last_name: 'Delos Santos',
			email: 'delossantos.mash@gmail.com',
		}
	},
}

export default defineEventHandler(async (event) => {
	const method = event.node.req.method || 'GET'

	let query: string | undefined
	let variables = undefined
	let operationName: string | undefined

	if (method === 'POST') {
		const body = await readBody(event)
		query = body.query
		variables = body.variables
		operationName = body.operationName
	} else if (method === 'GET') {
		const queryParams = getQuery(event)
		query = queryParams.query as string
		variables = queryParams.variables
		operationName = queryParams.operationName as string
	}

	if (!query) {
		return {
			errors: [{ message: 'No query provided' }],
		}
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
