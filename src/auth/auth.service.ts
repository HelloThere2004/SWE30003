import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private tokenBlacklist: Set<string> = new Set();

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService, // Inject UserService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<object> {
    // Reuse the create method from UserService
    return this.userService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto): Promise<object> {
    const { email, password } = signInDto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }

    // Log the hashed password and the provided password for debugging
    console.log('Stored Hashed Password:', user.password);
    console.log('Provided Password:', password);

    if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
    }

    // Include the user's role in the token payload
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role }, 
        'secretKey',
        { expiresIn: '1h' }
    );
    return { message: 'Sign-in successful', token };
  }

  /**
   * Sign out a user.
   * Adds the token to a blacklist to invalidate it.
   * @param token - The JWT token to invalidate.
   * @returns A message confirming the sign-out.
   */
  async signOut(token: string): Promise<object> {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    this.tokenBlacklist.add(token);
    return { message: 'Sign-out successful' };
  }

  /**
   * Check if a token is blacklisted.
   * @param token - The JWT token to check.
   * @returns True if the token is blacklisted, false otherwise.
   */
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
