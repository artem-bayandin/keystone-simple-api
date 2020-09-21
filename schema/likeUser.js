const { ...fields } = require('@keystonejs/fields')
const { ...listNames } = require('./listNames')
const { isRequest, isAdmin } = require('../utils')

const LikeUserSchema = {
    fields: {
        sender: { 
            type: fields.Relationship, 
            ref: `${listNames.UserListName}.sentKarma`, 
            isRequired: true,
            many: false
        },
        recipient: { 
            type: fields.Relationship, 
            ref: `${listNames.UserListName}.receivedKarma`, 
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
    LikeUserSchema
}