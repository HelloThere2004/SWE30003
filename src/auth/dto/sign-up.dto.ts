import { IsEmail, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class SignUpDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  vehicleModel?: string;
}
