import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';
import { UserService } from './user.service';

@Controller('user')

export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get("findAll") 
    findAll() {
        return this.userService.findAll();
    }

    @Get('findOne/:id')
    findOne(@Param('id') id: number): object {
        return this.userService.findOne(id);
    }

    @Post('create')
    create(@Body() createUserDto: createUserDto): object {
        return this.userService.create(createUserDto);
    }
}
