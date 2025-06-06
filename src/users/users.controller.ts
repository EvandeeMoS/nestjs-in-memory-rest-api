import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './model/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    isArray: true,
    type: User,
    description: 'Ok. List of all users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
    description: 'Ok. List the user with the passed Id',
  })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Public()
  @ApiCreatedResponse({
    type: User,
    description: 'Created. The user was succefully created',
  })
  async create(@Body(ValidationPipe) data: CreateUserDto) {
    return await this.usersService.create(data);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: User,
    description: 'Ok. The user was succefully updated',
  })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  update(@Param('id') id: string, @Body(ValidationPipe) data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({
    type: User,
    description: 'Ok. The user was succefully deleted',
  })
  @ApiNotFoundResponse({
    description: "Not found. A user with the passed id doesn't exist",
  })
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
