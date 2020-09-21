const { ...fields } = require('@keystonejs/fields')
const { ...listNames } = require('./listNames')
const { isAdmin, isAuthenticated, isRequest, readOnly } = require('../utils')

const UserSchema = {
    fields: {
        username: {
            type: fields.Text,
            isUnique: true,
            isRequired: true,
            access: {
                ...readOnly
            }
        },
        password: {
            type: fields.Password,
            isRequired: true,
            access: {
                update: async (params) => {
                    const userId = await isAuthenticated(params)
                    if (!userId) return false
                    return userId === params.existingItem.id
                },
                delete: false
            }
        },
        isAdmin: { 
            type: fields.Checkbox,
            hooks: {
                resolveInput: async (params) => {
                    const adm = await isAdmin(params)
                    const req = await isRequest(params)
                    return adm || !req ? params.originalInput.isAdmin : false
                }
            }
        },
        comments: {
            type: fields.Relationship,
            ref: `${listNames.CommentListName}.user`,
            many: true
        },
        likedComments: {
            type: fields.Relationship,
            ref: `${listNames.LikeCommentListName}.user`,
            many: true
        },
        sentKarma: {
            type: fields.Relationship,
            ref: `${listNames.LikeUserListName}.sender`,
            many: true
        },
        receivedKarma: {
            type: fields.Relationship,
            ref: `${listNames.LikeUserListName}.recipient`,
            many: true
        }
    },
    access: {
        delete: isAdmin,
        auth: true
    }
}

module.exports = {
    UserSchema
}