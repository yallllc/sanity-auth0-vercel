if (typeof window === 'undefined') {
  /**
   * Settings exposed to the server.
   */
  module.exports = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_ON_LOGIN: process.env.AUTH0_ON_LOGIN,
    AUTH0_ON_LOGOUT: process.env.AUTH0_ON_LOGOUT,
    AUTH0_COOKIE_SECRET: process.env.AUTH0_COOKIE_SECRET,
    AUTH0_COOKIE_EXPIRY: process.env.AUTH0_COOKIE_EXPIRY,
  };
} else {
  /**
   * Settings exposed to the client.
   */
  module.exports = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_ON_LOGIN: process.env.AUTH0_ON_LOGIN,
    AUTH0_ON_LOGOUT: process.env.AUTH0_ON_LOGOUT,
  };
}
