import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { Ride } from '../entities/ride.entity';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Ride, User])],
    controllers: [RideController],
    providers: [RideService, AuthGuard]
})
export class RideModule {}
