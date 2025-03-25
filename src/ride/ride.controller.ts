import { Controller, Post, Body, Get, Param, Put, ParseIntPipe } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { RideStatus } from '../entities/ride.entity';

@Controller('ride')
export class RideController {
    constructor(private readonly rideService: RideService) {}

    @Post('request')
    requestRide(@Body() createRideDto: CreateRideDto) {
        return this.rideService.createRide(createRideDto);
    }

    @Get('customer/:customerId')
    getCustomerRides(@Param('customerId', ParseIntPipe) customerId: number) {
        return this.rideService.getCustomerRides(customerId);
    }

    @Get('driver/:driverId')
    getDriverRides(@Param('driverId', ParseIntPipe) driverId: number) {
        return this.rideService.getDriverRides(driverId);
    }

    @Put(':rideId/status')
    updateRideStatus(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('status') status: RideStatus,
    ) {
        return this.rideService.updateRideStatus(rideId, status);
    }

    @Put(':rideId/feedback')
    provideFeedback(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('rating') rating: number,
        @Body('feedback') feedback: string,
    ) {
        return this.rideService.provideFeedback(rideId, rating, feedback);
    }
}
