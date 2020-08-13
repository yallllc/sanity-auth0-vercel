import sanityClient from '@sanity/client';
import fetch from 'isomorphic-unfetch';
import { auth0 } from '../src/auth0';
import { hashUserId } from '../src/hashUserId';
import {
  grantsByRole,
  removeFromGroups,
  Role,
  roleStrings,
} from '../src/roles';

const NotAuthorizedError = new Error('User is not authorized to edit the CMS.');

const logAllGroups = true;

export default async function do_sanity_login(req, res) {
  try {
    const session = await auth0.getSession(req);
    const user = session.user;
    const roles = user[process.env.AUTH0_ROLES_KEY];
    const userId = hashUserId(user.sub); // auth0 user id - throws if missing
    let role: Role;
    if (roles && roles.includes(Role.Admin)) {
      role = Role.Admin;
    } else if (roles && roles.includes(Role.Editor)) {
      role = Role.Editor;
    }
    if (!role) {
      throw NotAuthorizedError;
    }

    const client = sanityClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      token: process.env.SANITY_AUTH_TOKEN,
      useCdn: false,
    });

    // Create all groups if they don't exist yet, or add a new one

    const testGroup = await client.getDocument(`_.groups.${role}`);
    if (!testGroup) {
      for (let r of roleStrings) {
        await client.createIfNotExists({
          _id: `_.groups.${r}`,
          _type: 'system.group',
          grants: grantsByRole[r],
          members: [],
        });
        const g = await client.getDocument(`_.groups.${r}`);
        console.log('created group', g);
      }
    }

    // Include user in group
    const group = await client.getDocument(`_.groups.${role}`);
    if (!group.members || !group.members.includes(userId)) {
      await client
        .patch(group._id)
        .setIfMissing({ members: [] })
        .append('members', [userId])
        .commit();
    }

    // Remove user from other excluded groups
    const removes = removeFromGroups[role] || removeFromGroups.default;
    for (let r of removes) {
      const g = await client.getDocument(`_.groups.${r}`);
      const members = g.members as string[];
      if (members && members.includes(userId)) {
        await client
          .patch(`_.groups.${r}`)
          .splice('members', members.indexOf(userId), 1, null)
          .commit();
        console.log('Role removed from user: ' + r);
      }
    }

    if (logAllGroups) {
      for (let r of roleStrings) {
        const g = await client.getDocument(`_.groups.${r}`);
        console.log(JSON.stringify(g, null, 2));
      }
    }

    // Get single-use Sanity auth token
    const expires = new Date();
    expires.setTime(
      expires.getTime() + parseInt(process.env.AUTH0_COOKIE_EXPIRY, 10) * 1000,
    );

    const sanityToken = await fetch(
      `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v1/auth/thirdParty/session`,
      {
        method: 'POST',
        body: JSON.stringify({
          userId,
          userFullName: user.name,
          userEmail: user.email,
          userImage: user.picture,
          userRole: role === Role.Admin ? 'administrator' : 'editor',
          sessionExpires: expires,
          sessionLabel: `SSO: ${user.name}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SANITY_AUTH_TOKEN}`,
        },
      },
    );
    const sanityTokenJson = await sanityToken.json();
    const claim = sanityTokenJson.endUserClaimUrl;
    console.log('Got Sanity auth token:', claim);

    // Finally use the one-time claim URL to initiate a studio session
    res.writeHead(302, {
      Location: `${claim}?origin=${process.env.SANITY_STUDIO_URL}`,
    });
    res.end();
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
