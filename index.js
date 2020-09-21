const { Keystone } = require('@keystonejs/keystone')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose')
const { createItem, getItems, updateItem } = require('@keystonejs/server-side-graphql-client')
const { ...schema } = require('./schema')
const config = require('./config.p')
const { registerMergeCommentLike } = require('./schema/custom/mergeCommentLike')
const { registerMergeUserLike } = require('./schema/custom/mergeUserLike')
const { registerCurrentLoggedInUser } = require('./schema/custom/currentLoggedInUser')

const { DB_NAME, DB_USER, DB_PASS, ADMIN_USERNAME, ADMIN_PASSWORD, MONGO_URI, COOKIE_SECRET } = config

const createOrUpdateAdminPass = async (ks, name, pass) => {
    if (!name) return
    const admin = await getItems({
        keystone: ks,
        listKey: schema.UserListName,
        where: { username: name }
    })
    if (admin && admin.length) {
        await updateItem({
            keystone: ks,
            listKey: schema.UserListName,
            item: {
                id: admin[0].id,
                data: {
                    password: pass,
                    isAdmin: true
                }
            }
        })
    } else {
        await createItem({
            keystone: ks,
            listKey: schema.UserListName,
            item: {
                username: name,
                password: pass,
                isAdmin: true
            }
        })
    }
}

const keystone = new Keystone({
    adapter: new MongooseAdapter({ mongoUri: MONGO_URI(DB_NAME, DB_USER, DB_PASS) }),
    cookieSecret: COOKIE_SECRET,
    onConnect: async keystone => {
        createOrUpdateAdminPass(keystone, ADMIN_USERNAME, ADMIN_PASSWORD)
    }
});

keystone.createList(schema.UserListName, schema.UserSchema)
const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: schema.UserListName,
    config: {
        identityField: 'username',
        secretField: 'password',
    },
})

keystone.createList(schema.UserListName, schema.UserSchema)
keystone.createList(schema.ArticleListName, schema.ArticleSchema)
keystone.createList(schema.CommentListName, schema.CommentSchema)
keystone.createList(schema.LikeCommentListName, schema.LikeCommentSchema)
keystone.createList(schema.LikeUserListName, schema.LikeUserSchema)

registerMergeCommentLike(keystone)
registerMergeUserLike(keystone)
registerCurrentLoggedInUser(keystone)

/* Standard KeystoneJS-only app */

// module.exports = {
//   keystone,
//   apps: [
//       new GraphQLApp(), 
//       new AdminUIApp({ authStrategy })
//     ]
// }

/* Custom servers as described in docs: https://www.keystonejs.com/guides/custom-server */

/* Keystone app with ExpressJS middleware */

module.exports = {
    configureExpress: app => {
        console.log('If you need any Express.js endpoints, you may put it here.')
        app.use('/', async (req, res, next) => {
            await next()
        })
    },
    keystone,
    apps: [
      new GraphQLApp(), 
      new AdminUIApp({ authStrategy })
    ]
}