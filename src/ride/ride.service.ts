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
     */
    async updateRideStatus(rideId: number, status: RideStatus) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        ride.status = status;
        return await this.rideRepository.save(ride);
    }

    /**
     * Provide feedback for a ride.
     * @param rideId - The ID of the ride.
     * @param rating - The rating given by the customer.
     * @param feedback - The feedback provided by the customer.
     */
    async provideFeedback(rideId: number, rating: number, feedback: string) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        ride.rating = rating;
        ride.feedback = feedback;
        return await this.rideRepository.save(ride);
    }

    /**
     * Get all feedback provided by customers.
     * Accessible by managers.
     */
    async getAllFeedback() {
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
}
