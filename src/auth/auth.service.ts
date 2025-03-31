import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<object> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const newUser = this.userRepo.create({ ...signUpDto, password: hashedPassword });
    return await this.userRepo.save(newUser);
  }

  async signIn(signInDto: SignInDto): Promise<object> {
    const { email, password } = signInDto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
    return { message: 'Sign-in successful', token };
  }
}
