import { IsEmail, IsNumber, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsEnum } from "class-validator";
import { UserRole } from "../../entities/user.entity";

export class updateUserDto {
    // Define the properties for updateUserDto
    // All properties are optional for updating

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
    role?: UserRole;

    @IsString()
    licensePlate?: string;

    @IsString()
    vehicleModel?: string;
}