import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';
import { updateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Retrieve all users.
     * @returns A list of all users.
     */
    @Get("findAll") 
    findAll() {
        return this.userService.findAll();
    }

    /**
     * Retrieve a specific user by ID.
     * @param id - The ID of the user to retrieve.
     * @returns The user object if found.
     */
    @Get('findOne/:id')
    findOne(@Param('id', ParseIntPipe) id: number): object {
        return this.userService.findOne(id);
    }

    /**
     * Create a new user.
     * @param createUserDto - The details of the user to be created.
     * @returns The created user object.
     */
    @Post('create')
    create(@Body() createUserDto: createUserDto): object {
        return this.userService.create(createUserDto);
    }

    /**
     * Create multiple users.
     * @param users - An array of user objects to be created.
     * @returns The created user objects.
     * Used for testing purposes.
     */
    @Post('create-multiple')
    createUsers(@Body() users: createUserDto[]): Promise<object[]> {
        return this.userService.createUsers(users);
    }

    /**
     * Update an existing user by ID.
     * @param id - The ID of the user to update.
     * @param updateUserDto - The updated details of the user.
     * @returns The updated user object.
     */
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: updateUserDto): Promise<object> {
        return this.userService.update(id, updateUserDto);
    }

    /**
     * Delete a user by ID.
     * @param id - The ID of the user to delete.
     * @returns A message confirming the deletion.
     */
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
        return this.userService.delete(id);
    }
}
