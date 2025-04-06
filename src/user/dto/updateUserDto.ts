import { IsEmail, IsNumber, IsNumberString, IsOptional, IsString, IsEnum } from "class-validator";
import { UserRole } from "../../entities/user.entity";

export class updateUserDto {
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsNumber()
    age?: number;
    
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsNumberString()
    phone?: string;
    
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    licensePlate?: string;

    @IsOptional()
    @IsString()
    vehicleModel?: string;
}