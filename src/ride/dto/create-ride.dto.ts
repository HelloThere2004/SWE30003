import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PaymentMethod } from '../../entities/ride.entity';

export class CreateRideDto {
    @IsString()
    @IsNotEmpty()
    pickupLocation: string;

    @IsString()
    @IsNotEmpty()
    dropoffLocation: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}
