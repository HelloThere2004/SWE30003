import { IsEmail, IsNumber, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsEnum } from "class-validator";
import { UserRole } from "../../entities/user.entity";

export class updateUserDto {
    // Define the properties for updateUserDto
    @IsString()
    name?: string;
    
    @IsNumber()
    age?: number;
    
    @IsEmail()
    email?: string;
    
    @IsNumberString()
    phone?: string;
    
    @IsString()
    password?: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    licensePlate?: string;

    @IsOptional()
    @IsString()
    vehicleModel?: string;
}