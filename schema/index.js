const { ArticleSchema } = require('./article')
const { CommentSchema } = require('./comment')
const { LikeCommentSchema } = require('./likeComment')
const { LikeUserSchema } = require('./likeUser')
const { UserSchema } = require('./user')
const { ...listNames } = require('./listNames')

module.exports = {
    ArticleSchema,
    CommentSchema,
    LikeCommentSchema,
    LikeUserSchema,
    UserSchema,
    ...listNames
}