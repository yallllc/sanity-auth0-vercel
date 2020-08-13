import { auth0 } from '../src/auth0';

export default async function on_logged_in(req, res) {
  try {
    await auth0.handleCallback(req, res, {
      redirectTo: '/api/do_sanity_login',
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
