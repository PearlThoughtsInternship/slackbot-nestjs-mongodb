import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageModel } from './message.model';

@Module({
  imports: [TypeOrmModule.forFeature([MessageModel])],
  controllers: [],
  providers: [MessageService],
  exports: [TypeOrmModule, MessageService]
})
export class MessageModule {}
