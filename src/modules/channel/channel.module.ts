import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { ChannelModel } from './channel.model';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelModel])],
  controllers: [],
  providers: [ChannelService],
  exports: [TypeOrmModule, ChannelService]
})
export class ChannelModule {}
