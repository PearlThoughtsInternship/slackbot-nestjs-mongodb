import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ViewOtpLogModel } from './view_otp_log.model';
import { ViewOtpLogService } from './view_otp_log.service';



@Module({
  imports: [TypeOrmModule.forFeature([ViewOtpLogModel])],
  providers: [ViewOtpLogService, ConfigService],
  exports: [TypeOrmModule, ViewOtpLogService]
})
export class ViewOtpLogModule {}