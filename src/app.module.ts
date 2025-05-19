import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Database } from './db';

@Module({
  imports: [UsersModule, Database],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
