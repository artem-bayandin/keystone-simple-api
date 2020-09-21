const { isAuthenticated } = require('../../utils')

const registerMergeUserLike = keystone => {
    const resolver = async (parent, args, context, info, extra) => {
        const senderId = await isAuthenticated({context})
        if (!senderId) throw 'You are not authenticated'
        const { recipientId, isLike } = args
        if (senderId === recipientId) throw 'You cannot like yourself'

        const findLikeResult = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
                query findLikesBySenderIdAndRecipientId(
                    $senderId: ID!,
                    $recipientId: ID!
                ) {
                    allKsAppLikeUsers(
                        where: {
                            sender: { id: $senderId },
                            recipient: { id: $recipientId }
                        }
                    ) {
                        id,
                        isLike
                    }
                }
            `,
            variables: { senderId: senderId, recipientId: recipientId },
        })
        if (findLikeResult.errors) {
            throw 'Read like failed'
        }
        const oldItem = findLikeResult.data && findLikeResult.data.allKsAppLikeUsers.length ? findLikeResult.data.allKsAppLikeUsers[0] : null
        let recordId = -1

        if (oldItem && oldItem.isLike === isLike) {
            recordId = oldItem.id
        } else if (oldItem) {
            recordId = oldItem.id
            const updateLikeResult = await context.executeGraphQL({
                context: context.createContext({ skipAccessControl: true }),
                query: `
                    mutation updateLike(
                        $likeId:ID!,
                        $isLike:Boolean!
                    ) {
                        updateKsAppLikeUser(
                            id: $likeId,
                            data: {
                                isLike: $isLike
                            }
                        ) {
                            id,
                            isLike
                        }
                    }
                `,
                variables: { likeId: recordId, isLike: isLike },
            })
            if (updateLikeResult.errors) {
                throw 'Like update failed'
            }
        } else {
            const createLikeResult = await context.executeGraphQL({
                context: context.createContext({ skipAccessControl: true }),
                query: `
                    mutation createLike(
                        $senderId:ID!, 
                        $recipientId:ID!, 
                        $isLike:Boolean!
                    ) {
                        createKsAppLikeUser(data: {
                            sender: { connect: { id: $senderId } },
                            recipient: { connect: { id: $recipientId } },
                            isLike: $isLike
                        }) {
                            id,
                            isLike
                        }
                    }
                `,
                variables: { senderId: senderId, recipientId: recipientId, isLike: isLike },
            })
            if (createLikeResult.errors) {
                throw 'Like create failed'
            }
            if (createLikeResult.data && createLikeResult.data.createKsAppLikeUser) {
                recordId = createLikeResult.data.createKsAppLikeUser.id
            }
        }
        return {
            id: recordId,
            recipientId,
            isLike
        }
    }

    keystone.extendGraphQLSchema({
        types: [
            {
                type: 'type MergeUserLikeOutput { id: ID, recipientId: ID, isLike: Boolean }'
            }
        ],
        mutations: [
            {
                schema: 'mergeUserLike(recipientId: ID!, isLike: Boolean!): MergeUserLikeOutput',
                resolver: resolver
            }
        ]
    })
}

module.exports = {
    registerMergeUserLike
}