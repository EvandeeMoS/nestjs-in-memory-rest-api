import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, UsersService, WalletsService],
})
export class TransfersModule {}
