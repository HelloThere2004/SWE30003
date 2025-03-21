import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

    async findAll() {
        const result: User[] = await this.userRepo.find();
        return result;
    }

    async findOne(id: number): Promise<object> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(createUserDto: createUserDto): Promise<object> {
        const newUser = this.userRepo.create(createUserDto);
        return await this.userRepo.save(newUser);
    }

    async update(id: number, updateUserDto: updateUserDto): Promise<object> {
        await this.userRepo.update(id, updateUserDto);
        const updatedUser = await this.userRepo.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }
}
