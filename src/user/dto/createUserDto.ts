import { IsEmail, IsNumber, IsNumberString, IsPhoneNumber, IsString } from "class-validator";

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

    
}