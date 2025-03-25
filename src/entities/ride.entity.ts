import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum RideStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum PaymentMethod {
    CASH = 'cash',
    ONLINE = 'online'
}

@Entity()
export class Ride {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pickupLocation: string;

    @Column()
    dropoffLocation: string;

    @Column('decimal')
    price: number;

    @Column({
        type: 'enum',
        enum: RideStatus,
        default: RideStatus.PENDING
    })
    status: RideStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true
    })
    paymentMethod: PaymentMethod;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.customerRides)
    customer: User;

    @ManyToOne(() => User, user => user.driverRides, { nullable: true })
    driver: User;

    @Column({ nullable: true })
    rating: number;

    @Column({ nullable: true })
    feedback: string;
}
