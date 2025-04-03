import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Ride } from "./ride.entity";

export enum UserRole {
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    MANAGER = 'manager'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250, nullable: false, unique: true})
    name: string;

    @Column({nullable: true})
    age: number;

    @Column({ length: 250, nullable: false, unique: true})
    email: string;

    @Column({ length: 10, nullable: false})
    phone: string;

    @Column({ length: 250, nullable: false})
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role: UserRole;

    @Column({ nullable: true })
    licensePlate?: string;

    @Column({ nullable: true })
    vehicleModel?: string;

    @OneToMany(() => Ride, ride => ride.customer)
    customerRides: Ride[];

    @OneToMany(() => Ride, ride => ride.driver)
    driverRides: Ride[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

    @BeforeInsert()
    async hashPassword() {
        console.log('Original Password:', this.password); // Log the original password
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Hashed Password:', this.password); // Log the hashed password
    }
}