import { SetMetadata } from '@nestjs/common';
import { UserRole } from './../users/entities/user.entity';

type AllowedRoles = keyof typeof UserRole;

export const Role = (roles: string[]) => SetMetadata('roles', roles);