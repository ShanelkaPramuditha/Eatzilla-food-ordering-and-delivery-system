import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces/user.interface';

export const ROLES_KEY = 'roles';

/**
 * Decorator that assigns allowed roles to a route or controller
 *
 * @param roles - Array of user roles that are allowed to access the route
 * @returns Decorator function
 *
 * @example
 * // Allow only admins to access this route
 * @Roles(UserRole.ADMIN)
 * @Get()
 * findAll() {
 *   return this.service.findAll();
 * }
 *
 * @example
 * // Allow both restaurant owners and admins
 * @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
 * @Get('restaurant/:id')
 * findByRestaurant() {
 *   // ...
 * }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
