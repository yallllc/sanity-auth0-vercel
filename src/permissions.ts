/**
 * This enum is dual-purposed as a key/value store, where the values
 * are Sanity api keywords - don't modify them!
 */
export enum Permission {
  Create = 'create',
  Read = 'read',
  Update = 'update',
}

export const commonPermissions = {
  all: [Permission.Create, Permission.Read, Permission.Update],
  readOnly: [Permission.Read],
};
