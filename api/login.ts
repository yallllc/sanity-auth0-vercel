import { auth0 } from '../src/auth0';

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res);
  } catch (error) {
    console.error(error);

    // In a real deployment, errors might be routed to the frontend's domain for display:
    // res.writeHead(302, {
    //   Location: process.env.ON_LOGIN_ERROR,
    // });
    // res.end();

    res.status(error.status || 500).end(error.message);
  }
}
