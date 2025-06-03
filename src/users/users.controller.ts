import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from './model/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: User,
    description: 'List of all users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
    description: 'List the user with the passed Id',
  })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({
    type: User,
    description: 'The user was succefully created',
  })
  async create(@Body(ValidationPipe) data: CreateUserDto) {
    return await this.usersService.create(data);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User, description: 'The user was succefully updated' })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  update(@Param('id') id: string, @Body(ValidationPipe) data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ type: User, description: 'The user was succefully deleted' })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
