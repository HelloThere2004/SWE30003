import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * Guard to check if the user is authenticated.
     * Verifies the JWT token from the request headers.
     * @param context - The execution context of the request.
     */
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            console.error('AuthGuard: No authorization header provided');
            throw new UnauthorizedException('No authorization header provided');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            console.error('AuthGuard: No token provided');
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = jwt.verify(token, 'secretKey'); // Ensure the secret key matches the one used in AuthService
            console.log('AuthGuard: Decoded Token:', decoded); // Debugging: Log the decoded token
            request.user = decoded; // Attach the decoded user information to the request
            console.log('AuthGuard: User object attached to request:', request.user); // Debugging: Log the user object
            return true;
        } catch (error) {
            console.error('AuthGuard: Token verification failed:', error); // Log the error for debugging
            throw new UnauthorizedException('Invalid token');
        }
    }
}
