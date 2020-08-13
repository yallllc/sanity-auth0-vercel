import { initAuth0 } from '@auth0/nextjs-auth0';
import config from './config';

export const auth0 = initAuth0({
  clientId: config.AUTH0_CLIENT_ID,
  clientSecret: config.AUTH0_CLIENT_SECRET,
  scope: config.AUTH0_SCOPE,
  domain: config.AUTH0_DOMAIN,
  redirectUri: config.AUTH0_ON_LOGIN,
  postLogoutRedirectUri: config.AUTH0_ON_LOGOUT,
  session: {
    cookieSecret: config.AUTH0_COOKIE_SECRET,
    cookieLifetime: config.AUTH0_COOKIE_EXPIRY,
    storeIdToken: false,
    storeRefreshToken: true,
    storeAccessToken: true,
  },
});
