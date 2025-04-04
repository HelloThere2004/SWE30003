import { Controller, Post, Body, Get, Param, Put, ParseIntPipe, UseGuards, UnauthorizedException, Delete } from '@nestjs/common';
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
        console.log('Authenticated User:', user); // Debugging: Log the authenticated user
        // Validate that the user has the 'customer' role
        if (user.role !== 'customer') {
            throw new UnauthorizedException('Only customers can view their ride history');
        }

        return this.rideService.getCustomerRideHistory(user.userId); // Ensure user.userId is passed
    }

    /**
     * Get all feedback provided by customers.
     * Accessible only by managers.
     */
    @UseGuards(AuthGuard)
    @Get('feedback')
    getAllFeedback(@CurrentUser() user: any) {
        if (!user ) {
            throw new UnauthorizedException('User not authenticated');
        }
        if ( user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can view feedback');
        }
        return this.rideService.getAllFeedback(user.role);
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
     * @param user - The currently authenticated driver.
     * @throws UnauthorizedException if the user is not a driver.
     */
    @UseGuards(AuthGuard)
    @Put(':rideId/status')
    updateRideStatus(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('status') status: RideStatus,
        @CurrentUser() user: any,
    ) {
        if (!user) {
            console.error('RideController: User is undefined in updateRideStatus'); // Log for debugging
            throw new UnauthorizedException('User not authenticated');
        }
        console.log('RideController: Authenticated User:', user); // Debugging: Log the authenticated user
        if (user.role !== 'driver') {
            throw new UnauthorizedException('Only drivers can update ride statuses');
        }
        return this.rideService.updateRideStatus(rideId, status, user.userId); // Pass user.userId
    }

    /**
     * Provide feedback for a ride.
     * @param rideId - The ID of the ride.
     * @param rating - The rating given by the customer.
     * @param feedback - The feedback provided by the customer.
     * @param user - The currently authenticated customer.
     * @throws UnauthorizedException if the user is not a customer.
     */
    @UseGuards(AuthGuard)
    @Put(':rideId/feedback')
    provideFeedback(
        @Param('rideId', ParseIntPipe) rideId: number,
        @Body('rating') rating: number,
        @Body('feedback') feedback: string,
        @CurrentUser() user: any,
    ) {
        console.log('Authenticated User:', user); // Debugging: Log the authenticated user
        if (user.role !== 'customer') {
            throw new UnauthorizedException('Only customers can provide feedback');
        }
        return this.rideService.provideFeedback(rideId, rating, feedback, user.userId); // Pass user.userId
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

        return this.rideService.assignDriverToRide(rideId, user.userId); // Use user.userId
    }

    /**
     * Delete/Cancel a ride.
     * @param rideId - The ID of the ride to cancel.
     * @param user - The currently authenticated user.
     */
    @UseGuards(AuthGuard)
    @Delete(':rideId')
    deleteRide(
        @Param('rideId', ParseIntPipe) rideId: number,
        @CurrentUser() user: any,
    ) {
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        if (user.role != 'customer' || user.role != 'driver') {
            throw new UnauthorizedException('Only customers or drivers can cancel rides');
        }
        return this.rideService.deleteRide(rideId, user.userId, user.role);
    }
}
