import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum AppRole {
  ADMIN = 'ADMIN',
  COOP_MANAGER = 'COOP_MANAGER',
  BUYER = 'BUYER',
}

export type AppRoleType = AppRole;

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

