import { IsEmail, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../entities/user.entity";

export class createUserDto {
    @IsString()
    name: string;

    @IsNumber()
    age: number;

    @IsEmail()
    email: string;

    @IsNumberString()
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

