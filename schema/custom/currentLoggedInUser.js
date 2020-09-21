const { isAuthenticated } = require('../../utils')
const { UserListName } = require('../listNames')
const queryName = 'currentLoggedInUser'

const registerCurrentLoggedInUser = keystone => {
    const resolver = async (parent, args, context, info, extra) => {
        const uid = await isAuthenticated({context})
        if (!uid) throw 'You are not authenticated'

        const requestBody = context && context.req && context.req.body ? context.req.body.query : ''
        if (!requestBody) return null

        const newBody = requestBody.replace(new RegExp(queryName,"gmi"), `${UserListName}(where: {id:"${uid}"})`)

        const query = `query ${newBody}`

        const queryUserResult = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: false, authentication: { item: context.authedItem, listKey: context.authedListKey } }),
            query: query
        })

        if (queryUserResult.errors) {
            throw errors
        }
        return { ...queryUserResult.data[UserListName] }
    }

    keystone.extendGraphQLSchema({
        queries: [
            {
                schema: `${queryName}: ${UserListName}`,
                resolver: resolver
            }
        ]
    })
}

module.exports = {
    registerCurrentLoggedInUser
}