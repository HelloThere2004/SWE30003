import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { SignUpDto } from '../auth/dto/sign-up.dto';

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
     * Handles both SignUpDto and createUserDto.
     * @param userDto - The details of the user to be created.
     * @returns The created user object.
     */
    async create(userDto: SignUpDto | createUserDto): Promise<object> {
        const newUser = this.userRepo.create(userDto);
        return await this.userRepo.save(newUser);
    }

    /**
     * Create multiple users in the database.
     * @param users - An array of user objects to be created.
     * @returns The created user objects.
     * Used for testing purposes.
     */
    async createUsers(users: createUserDto[]): Promise<object[]> {
        const newUsers = this.userRepo.create(users);
        return await this.userRepo.save(newUsers);
    }

    /**
     * Update an existing user in the database.
     * @param id - The ID of the user to update.
     * @param updateUserDto - The updated details of the user.
     * @returns The updated user object.
     * @throws NotFoundException if the user is not found.
     */
    async update(id: number, updateUserDto: updateUserDto): Promise<object> {
        await this.userRepo.update(id, updateUserDto);
        const updatedUser = await this.userRepo.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
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
