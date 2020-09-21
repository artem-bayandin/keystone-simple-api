const { ...fields } = require('@keystonejs/fields')
const { ...listNames } = require('./listNames')
const { isRequest, isAdmin } = require('../utils')

const LikeCommentSchema = {
    fields: {
        user: { 
            type: fields.Relationship, 
            ref: `${listNames.UserListName}.likedComments`, 
            isRequired: true,
            many: false
        },
        comment: { 
            type: fields.Relationship, 
            ref: `${listNames.CommentListName}.likes`, 
            isRequired: true,
            many: false
        },
        isLike: {
            type: fields.Checkbox,
            isRequired: true
        }
    },
    access: {
        create: isRequest,
        update: isRequest,
        delete: isAdmin,
        auth: true
    }
}

module.exports = {
    LikeCommentSchema
}