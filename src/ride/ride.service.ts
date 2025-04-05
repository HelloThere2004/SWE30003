import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Ride, RideStatus } from '../entities/ride.entity';
import { User } from '../entities/user.entity';
import { CreateRideDto } from './dto/create-ride.dto';

@Injectable()
export class RideService {
    constructor(
        @InjectRepository(Ride)
        private rideRepository: Repository<Ride>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    /**
     * Create a new ride for a customer.
     * Validates that the user has the 'customer' role before creating the ride.
     * @param createRideDto - The details of the ride to be created.
     * @param customerId - The ID of the customer requesting the ride.
     * @throws UnauthorizedException if the user is not a customer.
     */
    async createRide(createRideDto: CreateRideDto, customerId: number) {
        console.log('Customer ID:', customerId); // Debugging: Log the customer ID
        const customer = await this.userRepository.findOne({ where: { id: customerId } });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        // Validate that the user is a customer
        if (customer.role !== 'customer') {
            throw new UnauthorizedException('Only customers can request rides');
        }

        const ride = this.rideRepository.create({
            ...createRideDto,
            price: Math.floor(Math.random() * 100) + 20, // Demo price calculation
            customer, // Ensure this is the authenticated customer
        });
        return await this.rideRepository.save(ride);
    }

    /**
     * Get all rides associated with a customer.
     * @param customerId - The ID of the customer.
     */
    async getCustomerRides(customerId: number) {
        const customer = await this.userRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return await this.rideRepository.find({
            where: { customer: { id: customerId } },
            relations: ['driver'],
        });
    }

    /**
     * Get the ride history (completed rides) of a customer.
     * @param customerId - The ID of the customer.
     */
    async getCustomerRideHistory(customerId: number) {
        const customer = await this.userRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return await this.rideRepository.find({
            where: { customer: { id: customerId }, status: RideStatus.COMPLETED },
            relations: ['driver'],
        });
    }

    /**
     * Get all rides associated with a driver.
     * @param driverId - The ID of the driver.
     */
    async getDriverRides(driverId: number) {
        const driver = await this.userRepository.findOne({ where: { id: driverId } });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return await this.rideRepository.find({
            where: { driver: { id: driverId } },
            relations: ['customer'],
        });
    }

    /**
     * Update the status of a ride.
     * @param rideId - The ID of the ride.
     * @param status - The new status of the ride.
     * @param driverId - The ID of the driver updating the status.
     */
    async updateRideStatus(rideId: number, status: RideStatus, driverId: number) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId }, relations: ['driver'] });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        if (!ride.driver || ride.driver.id !== driverId) {
            throw new UnauthorizedException('You can only update the status of rides you have accepted');
        }
        // Add validation for cancelled rides
        if (ride.status === RideStatus.CANCELLED) {
            throw new UnauthorizedException('Cannot update status of cancelled rides');
        }
        if (ride.status === RideStatus.COMPLETED) {
            throw new UnauthorizedException('Cannot update status of completed rides');
        }
        ride.status = status;
        return await this.rideRepository.save(ride);
    }

    /**
     * Provide feedback for a ride.
     * @param rideId - The ID of the ride.
     * @param rating - The rating given by the customer.
     * @param feedback - The feedback provided by the customer.
     * @param customerId - The ID of the customer providing feedback.
     */
    async provideFeedback(rideId: number, rating: number, feedback: string, customerId: number) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId }, relations: ['customer'] });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        if (ride.customer.id !== customerId) {
            throw new UnauthorizedException('You can only provide feedback for your own rides');
        }
        // Add status check
        if (ride.status === RideStatus.CANCELLED) {
            throw new UnauthorizedException('Cannot provide feedback for cancelled rides');
        }
        if (ride.status !== RideStatus.COMPLETED) {
            throw new UnauthorizedException('Can only provide feedback for completed rides');
        }
        ride.rating = rating;
        ride.feedback = feedback;
        return await this.rideRepository.save(ride);
    }

    /**
     * Get all feedback provided by customers.
     * Accessible by managers.
     * @param userRole - The role of the user requesting feedback.
     */
    async getAllFeedback(userRole: string) {
        if (userRole !== 'manager') {
            throw new UnauthorizedException('Only managers can access all feedback');
        }

        return await this.rideRepository.find({
            where: { feedback: Not('') },
            select: ['id', 'feedback', 'rating', 'customer'],
            relations: ['customer'],
        });
    }

    /**
     * Assign a driver to a ride.
     * Validates that the driver exists and updates the ride with the driver's information.
     * @param rideId - The ID of the ride to be updated.
     * @param driverId - The ID of the driver accepting the ride.
     * @throws NotFoundException if the ride or driver is not found.
     */
    async assignDriverToRide(rideId: number, driverId: number) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId }, relations: ['customer'] });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        const driver = await this.userRepository.findOne({ where: { id: driverId } });
        if (!driver || driver.role !== 'driver') {
            throw new NotFoundException('Driver not found or invalid role');
        }
        ride.driver = driver;
        ride.status = RideStatus.ACCEPTED; // Update status to accepted
        return await this.rideRepository.save(ride);
    }

    /**
     * Get ride details including customer and driver information.
     * @param rideId - The ID of the ride.
     * @returns The ride details with customer and driver information.
     * @throws NotFoundException if the ride is not found.
     */
    async getRideDetails(rideId: number) {
        const ride = await this.rideRepository.findOne({
            where: { id: rideId },
            relations: ['customer', 'driver'],
        });

        if (!ride) {
            throw new NotFoundException('Ride not found');
        }

        return ride;
    }

    /**
     * Delete or cancel a ride.
     * Validates the user's role and permissions before allowing cancellation.
     * @param rideId - The ID of the ride to be cancelled.
     * @param userId - The ID of the user requesting cancellation.
     * @param userRole - The role of the user requesting cancellation.
     * @throws NotFoundException if the ride is not found.
     * @throws UnauthorizedException if the user does not have permission to cancel the ride.
     */
    async deleteRide(rideId: number, userId: number, userRole: string) {
        const ride = await this.rideRepository.findOne({ 
            where: { id: rideId },
            relations: ['customer', 'driver']
        });

        if (!ride) {
            throw new NotFoundException('Ride not found');
        }

        // Check if the user has permission to cancel the ride
        if (userRole === 'customer' && ride.customer.id !== userId) {
            throw new UnauthorizedException('You can only cancel your own rides');
        }
        if (userRole === 'driver' && ride.driver?.id !== userId) {
            throw new UnauthorizedException('You can only cancel rides assigned to you');
        }

        // Only allow cancellation if ride is in PENDING or ACCEPTED state
        if (ride.status !== RideStatus.PENDING && ride.status !== RideStatus.ACCEPTED) {
            throw new UnauthorizedException('Cannot cancel a ride that is in progress or completed');
        }

        ride.status = RideStatus.CANCELLED;
        return await this.rideRepository.save(ride);
    }
}
