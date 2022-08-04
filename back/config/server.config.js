const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || '8080'
// 600000 ms = 10 min
const APP_ACCESS_TOKEN_LIFETIME = process.APP_ACCESS_TOKEN_LIFETIME || '600000'
// 1800000 ms = 30 min
const APP_REFRESH_TOKEN_LIFETIME = process.APP_REFRESH_TOKEN_LIFETIME || '1800000'

module.exports = {
    host: APP_HOST,
    port: APP_PORT,
    accessTokenLifetime: parseInt(APP_ACCESS_TOKEN_LIFETIME),
    refreshTokenLifetime: parseInt(APP_REFRESH_TOKEN_LIFETIME)
}
