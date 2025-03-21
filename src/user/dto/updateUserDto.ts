import { IsEmail, IsNumber, IsNumberString, IsPhoneNumber, IsString } from "class-validator";


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
}