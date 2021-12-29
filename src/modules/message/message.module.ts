import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { ConfigService } from '../../shared/config.service';
import { MessageModel } from './message.model';

@Module({
  imports: [TypeOrmModule.forFeature([MessageModel])],
  controllers: [],
  providers: [MessageService, ConfigService],
  exports: [TypeOrmModule, MessageService]
})
export class MessageModule {}
