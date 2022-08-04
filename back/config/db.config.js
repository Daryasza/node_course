const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = process.env.DB_PORT || '27017'
const DB_NAME = process.env.DB_NAME || 'loft'
const DB_USER = process.env.DB_USER || 'loft'
const DB_PASS = process.env.DB_USER || 'loft'

module.exports = {
    url: `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
}
