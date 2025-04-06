import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { updateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Retrieve all users.
     * @returns A list of all users.
     */
    @UseGuards(AuthGuard)
    @Get("findAll") 
    findAll(@CurrentUser() user: any) {
        if (user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can view all users');
        }
        return this.userService.findAll();
    }

    /**
     * Retrieve a specific user by ID.
     * @param id - The ID of the user to retrieve.
     * @returns The user object if found.
     */
    @UseGuards(AuthGuard)
    @Get('findOne/:id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: any
    ): object {
        if (user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can view user details');
        }
        return this.userService.findOne(id);
    }

    /**
     * Create a new user.
     * @param signUpDto - The details of the user to be created.
     * @returns The created user object.
     */
    @UseGuards(AuthGuard)
    @Post('create')
    create(
        @Body() signUpDto: SignUpDto,
        @CurrentUser() user: any
    ): object {
        if (user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can create users');
        }
        return this.userService.create(signUpDto);
    }

    /**
     * Create multiple users.
     * @param users - An array of user objects to be created.
     * @returns The created user objects.
     * Used for testing purposes.
     */
    @UseGuards(AuthGuard)
    @Post('create-multiple')
    createUsers(
        @Body() users: SignUpDto[],
        @CurrentUser() user: any
    ): Promise<object[]> {
        if (user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can create multiple users');
        }
        return this.userService.createUsers(users);
    }

    /**
     * Update an existing user by ID.
     * @param id - The ID of the user to update.
     * @param updateUserDto - The updated details of the user.
     * @returns The updated user object.
     */
    @UseGuards(AuthGuard)
    @Put('update/:id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDto: updateUserDto,
        @CurrentUser() user: any
    ): Promise<object> {
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        // Check if the user is trying to update their own information
        if (user.userId !== id) {
            throw new UnauthorizedException('You can only update your own information');
        }
        return this.userService.update(id, updateUserDto, user.role);
    }

    /**
     * Delete a user by ID.
     * @param id - The ID of the user to delete.
     * @returns A message confirming the deletion.
     */
    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: any
    ): Promise<object> {
        if (user.role !== 'manager') {
            throw new UnauthorizedException('Only managers can delete users');
        }
        return this.userService.delete(id);
    }
}
