import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * `CurrentUser` is a custom decorator that extracts the current user
 * from the request object.
 * 
 * @param {unknown} data - This parameter can be used to pass additional data to the decorator (unused here).
 * @param {ExecutionContext} context - Provides details about the execution context.
 * 
 * @returns {any} - Returns the `user` object from the request.
 * 
 * @example
 * In a controller, you can use the decorator like this:
 * 
 * ```ts
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
