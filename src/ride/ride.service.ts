import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async createRide(createRideDto: CreateRideDto) {
        const ride = this.rideRepository.create({
            ...createRideDto,
            price: Math.floor(Math.random() * 100) + 20, // Demo price calculation
        });
        return await this.rideRepository.save(ride);
    }

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

    async updateRideStatus(rideId: number, status: RideStatus) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        ride.status = status;
        return await this.rideRepository.save(ride);
    }

    async provideFeedback(rideId: number, rating: number, feedback: string) {
        const ride = await this.rideRepository.findOne({ where: { id: rideId } });
        if (!ride) {
            throw new NotFoundException('Ride not found');
        }
        ride.rating = rating;
        ride.feedback = feedback;
        return await this.rideRepository.save(ride);
    }
}
