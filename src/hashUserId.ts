import { createHmac } from 'crypto';

export const hashUserId = (username: string) => {
  if (!username) {
    throw new Error('Username not found');
  }
  const hash = createHmac('sha256', process.env.AUTH0_COOKIE_SECRET)
    .update(username.toLowerCase())
    .digest('hex');

  // Sanity user ids must start with e-
  return `e-${hash}`;
};
