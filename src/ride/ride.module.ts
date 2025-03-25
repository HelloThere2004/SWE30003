import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { Ride } from '../entities/ride.entity';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ride, User])],
    controllers: [RideController],
    providers: [RideService]
})
export class RideModule {}
