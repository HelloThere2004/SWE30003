import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { updateUserDto } from './dto/updateUserDto';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

    /**
     * Retrieve all users from the database.
     * @returns A list of all users.
     */
    async findAll() {
        const result: User[] = await this.userRepo.find();
        return result;
    }

    /**
     * Retrieve a specific user by ID.
     * @param id - The ID of the user to retrieve.
     * @returns The user object if found.
     * @throws NotFoundException if the user is not found.
     */
    async findOne(id: number): Promise<object> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    /**
     * Create a new user in the database.
     * @param signUpDto - The details of the user to be created.
     * @returns The created user object.
     */
    async create(signUpDto: SignUpDto): Promise<object> {
        const newUser = this.userRepo.create(signUpDto);
        return await this.userRepo.save(newUser);
    }

    /**
     * Create multiple users in the database.
     * @param users - An array of user objects to be created.
     * @returns The created user objects.
     */
    async createUsers(users: SignUpDto[]): Promise<object[]> {
        const newUsers = this.userRepo.create(users);
        return await this.userRepo.save(newUsers);
    }

    /**
     * Update an existing user in the database.
     * @param id - The ID of the user to update.
     * @param updateUserDto - The updated details of the user.
     * @param userRole - The role of the user making the update request.
     * @returns The updated user object.
     * @throws NotFoundException if the user is not found.
     * @throws UnauthorizedException if attempting to change the user role.
     */
    async update(id: number, updateUserDto: updateUserDto, userRole: string): Promise<object> {
        // Prevent changing role through update
        if (updateUserDto.role && updateUserDto.role !== userRole) {
            throw new UnauthorizedException('Cannot change user role');
        }
    
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    
        // Hash password if it's being updated
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
    
        await this.userRepo.update(id, { ...updateUserDto } as any);
        const updatedUser = await this.userRepo.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found after update`);
        }
        return updatedUser;
    }

    /**
     * Delete a user from the database.
     * @param id - The ID of the user to delete.
     * @returns A message confirming the deletion.
     * @throws NotFoundException if the user is not found.
     */
    async delete(id: number): Promise<object> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepo.remove(user);
        return { message: `User with ID ${id} has been deleted` };
    }
}
