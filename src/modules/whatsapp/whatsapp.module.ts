import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappService } from './whatsapp.service';
import { WhatsappModel } from './whatsapp.model';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsappModel])],
  controllers: [],
  providers: [WhatsappService],
  exports: [TypeOrmModule, WhatsappService]
})
export class WhatsappModule {}
