import { commonPermissions } from './permissions';

/**
 * This enum is dual-purposed as a key/value store, where the values
 * are auth0 keywords - don't modify them!
 */
export enum Role {
  Admin = 'admin',
  Editor = 'editor',
}

export const roleStrings: string[] = Object.values(Role);

/**
 * Configures groups a user should be removed from when role changes.
 */
export const removeFromGroups = {
  [Role.Admin]: roleStrings.filter((r) => r !== Role.Admin),
  [Role.Editor]: [Role.Admin],
  default: [Role.Admin],
};

/**
 * Configures specific access permissions for each role.
 */
export const grantsByRole = {
  [Role.Admin]: [
    {
      path: `*`,
      permissions: commonPermissions.all,
    },
  ],
  [Role.Editor]: [
    {
      path: `*`,
      permissions: commonPermissions.all,
    },
    // Later we can set up filters to limit author permissions, e.g.:
    {
      filter: `_type == "category"`,
      permissions: [],
    },
  ],
};
