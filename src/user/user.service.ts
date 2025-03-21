import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
    async findAll() {
        const result: User[] = await this.userRepo.find();
        return result;
    }

    async findOne(id: number) {
        return await this.userRepo.findOne({where:{id: id}});
    }

    async create(createUserDto: createUserDto) {
        const user = await this.userRepo.create(createUserDto);
        return await this.userRepo.save(user);
    }
}
