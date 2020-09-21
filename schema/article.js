const { ...fields } = require('@keystonejs/fields')
const { ...listNames } = require('./listNames')
const { readOnly, isAuthenticated } = require('../utils')

const ArticleSchema = {
    fields: {
        title: {
            type: fields.Text,
            isUnique: true,
            isRequired: true,
            // access: {
            //     create: async (params) => {
            //         const { authentication, listKey, fieldKey, originalInput, operation, gqlName, context: { authedItem } } = params
            //         const dataLog = { authentication, listKey, fieldKey, originalInput, operation, gqlName, authedItem }
            //         console.log('~~~ Article.title.access.create ~', params)
            //         return true
            //     }
            // }
        },
        text: {
            type: fields.Text,
            isRequired: true,
        },
        created: {
            type: fields.DateTimeUtc,
            hooks: {
                resolveInput: async () => {
                    return new Date().toUTCString()
                }
            },
        },
        comments: {
            type: fields.Relationship,
            ref: `${listNames.CommentListName}.article`,
            many: true
        }
    },
    access: {
        ...readOnly,
        create: isAuthenticated,
        auth: true
    },
    // hooks: {
    //     resolveInput: async (params) => {
    //         const { originalInput, resolvedData, existingItem, context: { authedItem }, operation, listKey } = params
    //         const dataLog = { originalInput, resolvedData, existingItem, authedItem, operation, listKey }
    //         console.log('~~~ Article.hooks.resolveInput ~', dataLog)
    //         return params.resolvedData
    //     }
    // }
}

module.exports = {
    ArticleSchema
}