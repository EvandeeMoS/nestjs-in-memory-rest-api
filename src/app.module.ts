import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Database } from './Database/db';
import { WalletsModule } from './wallets/wallets.module';
import { TransfersModule } from './transfer/transfers.module';

@Module({
  imports: [UsersModule, Database, WalletsModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
