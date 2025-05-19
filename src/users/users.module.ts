import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  providers: [UsersService, WalletsService],
  controllers: [UsersController],
})
export class UsersModule {}
