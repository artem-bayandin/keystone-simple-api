const { isAuthenticated } = require('../../utils')

const registerMergeCommentLike = keystone => {
    const resolver = async (parent, args, context, info, extra) => {
        const uid = await isAuthenticated({context})
        if (!uid) throw 'You are not authenticated'
        const { commentId, isLike } = args

        const findLikeResult = await context.executeGraphQL({
            context: context.createContext({ skipAccessControl: true }),
            query: `
                query findLikesByUserIdAndCommentId(
                    $commentId: ID!,
                    $userId: ID!
                ) {
                    allKsAppLikeComments(
                        where: {
                            comment: { id: $commentId },
                            user: { id: $userId }
                        }
                    ) {
                        id,
                        isLike
                    }
                }
            `,
            variables: { commentId: commentId, userId: uid },
        })
        if (findLikeResult.errors) {
            throw 'Read like failed'
        }
        const oldItem = findLikeResult.data && findLikeResult.data.allKsAppLikeComments.length ? findLikeResult.data.allKsAppLikeComments[0] : null
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
                        updateKsAppLikeComment(
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
                        $commentId:ID!, 
                        $userId:ID!, 
                        $isLike:Boolean!
                    ) {
                        createKsAppLikeComment(data: {
                            comment: { connect: { id: $commentId } },
                            user: { connect: { id: $userId } },
                            isLike: $isLike
                        }) {
                            id,
                            isLike
                        }
                    }
                `,
                variables: { commentId: commentId, userId: uid, isLike: isLike },
            })
            if (createLikeResult.errors) {
                throw 'Like create failed'
            }
            if (createLikeResult.data && createLikeResult.data.createKsAppLikeComment) {
                recordId = createLikeResult.data.createKsAppLikeComment.id
            }
        }
        return {
            id: recordId,
            commentId,
            isLike
        }
    }

    keystone.extendGraphQLSchema({
        types: [
            {
                type: 'type MergeCommentLikeOutput { id: ID, commentId: ID, isLike: Boolean }'
            }
        ],
        mutations: [
            {
                schema: 'mergeCommentLike(commentId: ID!, isLike: Boolean!): MergeCommentLikeOutput',
                resolver: resolver
            }
        ]
    })
}

module.exports = {
    registerMergeCommentLike
}