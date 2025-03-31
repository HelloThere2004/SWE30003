import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("findAll") 
    findAll() {
        return this.userService.findAll();
    }

    @Get('findOne/:id')
    findOne(@Param('id', ParseIntPipe) id: number): object {
        return this.userService.findOne(id);
    }

    @Post('create')
    create(@Body() createUserDto: createUserDto): object {
        const { role } = createUserDto;
        return this.userService.create(createUserDto);
    }

    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: updateUserDto): Promise<object> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return this.userService.delete(id);
    }
}
