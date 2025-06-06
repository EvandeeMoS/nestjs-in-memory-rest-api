import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  controllers: [TransfersController],
  providers: [
    TransfersService,
    UsersService,
    WalletsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class TransfersModule {}
