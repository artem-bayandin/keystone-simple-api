const { AuthedRelationship } = require('@keystonejs/fields-authed-relationship')
const { ...fields } = require('@keystonejs/fields')
const { ...listNames } = require('./listNames')
const { isAdmin, isAuthenticated, readOnly } = require('../utils')

const CommentSchema = {
    fields: {
        user: { 
            type: AuthedRelationship, 
            ref: `${listNames.UserListName}.comments`, 
            many: false,
        },
        article: { 
            type: fields.Relationship, 
            ref: `${listNames.ArticleListName}.comments`, 
            isRequired: true,
            many: false,
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
        likes: {
            type: fields.Relationship,
            ref: `${listNames.LikeCommentListName}.comment`,
            many: true
        }
    },
    access: {
        ...readOnly,
        create: isAuthenticated,
        auth: true
    }
}

module.exports = {
    CommentSchema
}