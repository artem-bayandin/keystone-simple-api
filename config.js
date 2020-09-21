module.exports = {
    DB_NAME: 'db_name',
    DB_USER: 'db_user',
    DB_PASS: 'db_pass',
    MONGO_URI: (dbName, dbUser, dbPass) => `mongodb+srv://${dbUser}:${dbPass}@cluster.mongodb.net/${dbName}?retryWrites=true&w=majority`,

    ADMIN_USERNAME: 'admin_username',
    ADMIN_PASSWORD: 'admin_password',

    COOKIE_SECRET: 'your long cookie',
}