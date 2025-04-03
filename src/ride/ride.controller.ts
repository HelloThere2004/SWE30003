import { Controller, Post, Body, Get, Param, Put, ParseIntPipe, UseGuards, UnauthorizedException } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { RideStatus } from '../entities/ride.entity';
import { AuthGuard } from '../auth/auth.guard'; // Assuming an AuthGuard exists
import { CurrentUser } from '../auth/current-user.decorator'; // Assuming a decorator for current user

@Controller('ride')
export class RideController {
    constructor(private readonly rideService: RideService) {}

    /**
     * Request a new ride.
     * Requires the user to be authenticated.
     * @param createRideDto - The details of the ride to be created.
     * @param user - The currently authenticated user.
     */
    @UseGuards(AuthGuard)
    @Post('request')
    requestRide(@Body() createRideDto: CreateRideDto, @CurrentUser() user: any) {
        console.log('Authenticated User:', user); // Debugging: Log the authenticated user
        if (!user || !user.userId) { // Use user.userId instead of user.id
            throw new UnauthorizedException('Invalid user or user ID');
        }
        return this.rideService.createRide(createRideDto, user.userId); // Pass user.userId
    }

    /**
     * Get the ride history of the currently authenticated customer.
     * Requires the user to be authenticated as a customer.
     * @param user - The currently authenticated customer.
     * @returns A list of completed rides for the customer.
     * @throws UnauthorizedException if the user is not a customer.
     */
    @UseGuards(AuthGuard)
    @Get('history')
    getCustomerRideHistory(@CurrentUser() user: any) {
        // Validate that the user has the 'customer' role
        if (user.role !== 'customer') {
            throw new UnauthorizedException('Only customers can view their ride history');
        }

        return this.rideService.getCustomerRideHistory(user.id);
    }

    /**
     * Get all feedback provided by customers.
     * Accessible by managers.
     */
    @Get('feedback')
    getAllFeedback() {
        return this.rideService.getAllFeedback();
    }

    /**
     * Get all rides associated with a customer.
     * @param customerId - The ID of the customer.
     */
    @Get('customer/:customerId')
    getCustomerRides(@Param('customerId', ParseIntPipe) customerId: number) {
        return this.rideService.getCustomerRides(customerId);
    }

    /**
     * Get all rides associated with a driver.
     * @param driverId - The ID of the driver.
     */
    @Get('driver/:driverId')
    getDriverRides(@Param('driverId', ParseIntPipe) driverId: number) {
        return this.rideService.getDriverRides(driverId);
    }

    /**
     * Update the status of a ride.
     * @param rideId - The ID of the ride.
     * @param status - The new status of the ride.
     */
    @Put(':rideId/status')
    updateRideStatus(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('status') status: RideStatus,
    ) {
        return this.rideService.updateRideStatus(rideId, status);
    }

    /**
     * Provide feedback for a ride.
     * @param rideId - The ID of the ride.
     * @param rating - The rating given by the customer.
     * @param feedback - The feedback provided by the customer.
     */
    @Put(':rideId/feedback')
    provideFeedback(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('rating') rating: number,
        @Body('feedback') feedback: string,
    ) {
        return this.rideService.provideFeedback(rideId, rating, feedback);
    }

    /**
     * Allow a driver to accept a ride.
     * Requires the user to be authenticated as a driver.
     * @param rideId - The ID of the ride to accept.
     * @param user - The currently authenticated driver.
     * @throws UnauthorizedException if the user is not a driver.
     */
    @UseGuards(AuthGuard)
    @Post(':rideId/accept')
    acceptRide(
        @Param('rideId', ParseIntPipe) rideId: number,
        @CurrentUser() user: any,
    ) {
        console.log('Authenticated User:', user); // Debugging: Log the authenticated user
        // Validate that the user has the 'driver' role
        if (user.role !== 'driver') {
            throw new UnauthorizedException('Only drivers can accept rides');
        }

        return this.rideService.assignDriverToRide(rideId, user.id);
    }

}
