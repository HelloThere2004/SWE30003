import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Custom decorator to extract the current user from the request.
 * @param data - Optional data to pass to the decorator.
 * @param ctx - The execution context of the request.
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request.user) {
            console.error('CurrentUser decorator: No user found on request'); // Log for debugging
            throw new UnauthorizedException('User not authenticated');
        }
        console.log('CurrentUser decorator: Current User:', request.user); // Debugging: Log the current user
        return request.user; // Ensure this returns the user attached by the AuthGuard
    },
);
