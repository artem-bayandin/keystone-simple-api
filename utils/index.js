const isAuthenticated = async (params) => {
    const { context: { authedItem } } = params
    return authedItem ? authedItem.id : false
}

const isAdmin = async (params) => {
    const { context: { authedItem } } = params
    if (!!authedItem) {
        const { id, username, password, isAdmin } = authedItem
    }
    return !!authedItem && !!authedItem.isAdmin
}

const isRequest = async (params) => {
    const { context: { req } } = params
    return !!req
}

const readOnly = { update: false, delete: isAdmin }

module.exports = {
    isAuthenticated,
    isAdmin,
    isRequest,
    readOnly
}