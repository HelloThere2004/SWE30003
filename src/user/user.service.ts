import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}
    findAll(): string {
        return 'This action returns all users';
    }

    async findOne(id: number) {
        return await this.userRepo.findOne({where:{id: id}});
    }

    create(createUserDto: any): object {
        return createUserDto;
    }
}
