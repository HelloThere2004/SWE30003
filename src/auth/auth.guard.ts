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
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decoded = jwt.verify(token, 'secretKey'); // Ensure the secret key matches the one used in AuthService
            console.log('Decoded Token:', decoded); // Debugging: Log the decoded token
            request.user = decoded; // Attach the decoded user information to the request
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
