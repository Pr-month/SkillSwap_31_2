import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/users.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// Этот декоратор позволяет назначать роли пользователям на уровне контроллеров или маршрутов
