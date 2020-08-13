import sanityClient from '@sanity/client';
import * as dotenv from 'dotenv';
import { grantsByRole, roleStrings } from '../src/roles';

dotenv.config({ path: __dirname + '/../.env' });

/*
 * If permissions are changed for a role, this script will update them
 * to the ones set in `grantsByRole`.
 *
 * Usage:
 * $ sanity exec ./migrations/updateGroupGrants.ts
 *
 * To update specific grants and skip others you can pass a space-delimited string
 * $ ROLES_TO_UPDATE='admin editor' sanity exec ./migrations/updateGroupGrants.ts
 */

const rolesToUpdate = process.env.ROLES_TO_UPDATE
  ? process.env.ROLES_TO_UPDATE.split(' ')
  : roleStrings;

// We need the full management-level token to make group changes
// so this migration generates the client in code, vs using the
// 'part:@sanity/base/client' import and exec --with-user-token flag.
const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const updateForRoles = async (roles: string[]) => {
  try {
    for (let role of roles) {
      const nextGrants = grantsByRole[role];
      if (!nextGrants) {
        throw new Error(`No grantsByRole entry for role '${role}'!`);
      }

      let group = await client.getDocument(`_.groups.${role}`);
      if (!group) {
        throw new Error(`Cannot update group '${role}' - not found!`);
      }
      const currentGrants = group.grants;

      // always update - not worth the trouble to try and diff just to skip one

      console.log(`\n\nOverwriting grants in group '${role}'`);
      console.log('\nBefore: \n', currentGrants);
      group = await client
        .patch(`_.groups.${role}`)
        .set({ grants: grantsByRole[role] })
        .commit();

      console.log('After: \n', group.grants);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateForRoles(rolesToUpdate).then(() => console.log('done'));
