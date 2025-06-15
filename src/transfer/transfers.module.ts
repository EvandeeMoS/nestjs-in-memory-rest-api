import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  controllers: [TransfersController],
  providers: [
    TransfersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    UsersModule,
    WalletsModule
  ]
})
export class TransfersModule {}
